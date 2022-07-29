import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {prisma} from '@skillrecordings/database'
import {first} from 'lodash'
import {add} from 'date-fns'
import {getCalculatedPriced, getSdk, stripe} from '../../server'
import {PurchaseStatus} from '../../enums'

export class CheckoutError extends Error {
  couponId?: string
  productId: string

  constructor(message: string, productId: string, couponId?: string) {
    super(message)
    this.name = 'CheckoutError'
    this.couponId = couponId
    this.productId = productId
  }
}

export async function stripeCheckout({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const {req} = params

    const ip_address = req.headers['x-forwarded-for'] as string

    try {
      const {getMerchantCoupon} = getSdk()
      const {
        productId,
        quantity: queryQuantity = 1,
        couponId,
        userId,
        upgradeFromPurchaseId,
      } = req.query

      const quantity = Number(queryQuantity)

      const user = userId
        ? await prisma.user.findUnique({
            where: {
              id: userId as string,
            },
            include: {
              merchantCustomers: true,
            },
          })
        : false

      const upgradeFromPurchase = upgradeFromPurchaseId
        ? await prisma.purchase.findFirst({
            where: {
              id: upgradeFromPurchaseId as string,
              status: PurchaseStatus.Valid,
            },
            include: {
              product: true,
            },
          })
        : false

      const availableUpgrade =
        quantity === 1 && upgradeFromPurchase
          ? await prisma.upgradableProducts.findFirst({
              where: {
                upgradableFromId: upgradeFromPurchase.productId,
                upgradableToId: productId as string,
              },
            })
          : false

      const customerId =
        user && user.merchantCustomers
          ? first(user.merchantCustomers)?.identifier
          : false

      const loadedProduct = await prisma.product.findFirst({
        where: {id: productId as string},
        include: {
          prices: true,
          merchantProducts: {
            include: {
              merchantPrices: true,
            },
          },
        },
      })

      const merchantCoupon = couponId
        ? await getMerchantCoupon({
            where: {
              id: couponId as string,
            },
          })
        : false

      const stripeCoupon =
        merchantCoupon && merchantCoupon.identifier
          ? await stripe.coupons.retrieve(merchantCoupon.identifier)
          : false

      const stripeCouponPercentOff =
        stripeCoupon && stripeCoupon.percent_off
          ? stripeCoupon.percent_off / 100
          : 0

      let discounts = []

      const isUpgrade = Boolean(availableUpgrade && upgradeFromPurchase)

      const TWELVE_FOUR_HOURS_FROM_NOW = Math.floor(
        add(new Date(), {hours: 12}).getTime() / 1000,
      )

      if (isUpgrade && upgradeFromPurchase && loadedProduct && customerId) {
        const fullPrice = loadedProduct.prices?.[0].unitAmount.toNumber()
        const calculatedPrice = getCalculatedPriced({
          unitPrice: fullPrice,
          percentOfDiscount: stripeCouponPercentOff || 0,
          quantity: 1,
          fixedDiscount: upgradeFromPurchase.totalAmount.toNumber(),
        })

        const coupon = await stripe.coupons.create({
          amount_off: (fullPrice - calculatedPrice) * 100,
          name: `Upgrade from ${upgradeFromPurchase.product.name}`,
          max_redemptions: 1,
          redeem_by: TWELVE_FOUR_HOURS_FROM_NOW,
          currency: 'USD',
          applies_to: {
            products: [
              loadedProduct.merchantProducts?.[0].identifier as string,
            ],
          },
        })

        discounts.push({
          coupon: coupon.id,
        })
      } else if (merchantCoupon && merchantCoupon.identifier) {
        const {id} = await stripe.promotionCodes.create({
          coupon: merchantCoupon.identifier,
          max_redemptions: 1,
          expires_at: TWELVE_FOUR_HOURS_FROM_NOW,
        })
        discounts.push({
          promotion_code: id,
        })
      }

      if (!loadedProduct) {
        throw new CheckoutError('No product was found', productId as string)
      }

      const price =
        loadedProduct.merchantProducts?.[0].merchantPrices?.[0].identifier

      if (!price) {
        throw new CheckoutError(
          'no-pricing-available',
          loadedProduct.id,
          couponId as string,
        )
      }

      const successUrl = isUpgrade
        ? `${process.env.NEXT_PUBLIC_URL}/welcome?session_id={CHECKOUT_SESSION_ID}&upgrade=true`
        : `${process.env.NEXT_PUBLIC_URL}/thanks/purchase?session_id={CHECKOUT_SESSION_ID}`

      const session = await stripe.checkout.sessions.create({
        discounts,
        line_items: [
          {
            price,
            quantity: Number(quantity),
          },
        ],
        expires_at: TWELVE_FOUR_HOURS_FROM_NOW,
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: `${req.headers.origin}/buy`,
        ...(customerId && {customer: customerId}),
        metadata: {
          ...(Boolean(availableUpgrade && upgradeFromPurchase) && {
            upgradeFromPurchaseId: upgradeFromPurchaseId as string,
          }),
          ip_address,
        },
      })

      if (session.url) {
        return {
          redirect: session.url,
          status: 303,
        }
      } else {
        throw new CheckoutError(
          'no-stripe-session',
          loadedProduct.id,
          couponId as string,
        )
      }
    } catch (err: any) {
      return {
        status: 500,
        body: {error: true, message: err.message},
      }
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
