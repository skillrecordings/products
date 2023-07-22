import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {getSdk, prisma} from '@skillrecordings/database'
import {first} from 'lodash'
import {add} from 'date-fns'
import {getCalculatedPriced, stripe} from '@skillrecordings/commerce-server'
import {getToken} from 'next-auth/jwt'
import {NextApiRequest} from 'next'
import {getFixedDiscountForUpgrade} from '@skillrecordings/commerce-server/src'

/**
 * Given a specific user we want to lookup their Stripe
 * customer ID and if one doesn't exist we will
 * create it.
 * @param userId
 */
async function findOrCreateStripeCustomerId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId as string,
    },
    include: {
      merchantCustomers: true,
    },
  })

  if (user) {
    const customerId =
      user && user.merchantCustomers
        ? first(user.merchantCustomers)?.identifier
        : false

    if (customerId) {
      return customerId
    } else {
      const merchantAccount = await prisma.merchantAccount.findFirst({
        where: {
          status: 1,
          label: 'stripe',
        },
      })
      if (merchantAccount) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        })
        await prisma.merchantCustomer.create({
          data: {
            identifier: customer.id,
            merchantAccountId: merchantAccount.id,
            userId,
          },
        })
        return customer.id
      }
    }
  }
  return false
}

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
    const token = await getToken({req: req as unknown as NextApiRequest})

    const ip_address = req.headers['x-forwarded-for'] as string

    try {
      const {getMerchantCoupon} = getSdk()
      const {
        productId,
        quantity: queryQuantity = 1,
        couponId,
        userId,
        upgradeFromPurchaseId,
        bulk = false,
        cancelUrl = `${req.headers.origin}/buy`,
      } = req.query

      const quantity = Number(queryQuantity)

      const user =
        userId || token?.sub
          ? await prisma.user.findUnique({
              where: {
                id: (userId as string) || (token?.sub as string),
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
              status: {in: ['Valid', 'Restricted']},
            },
            include: {
              product: true,
            },
          })
        : null

      const availableUpgrade =
        quantity === 1 && upgradeFromPurchase
          ? await prisma.upgradableProducts.findFirst({
              where: {
                upgradableFromId: upgradeFromPurchase.productId,
                upgradableToId: productId as string,
              },
            })
          : false

      const customerId = user
        ? await findOrCreateStripeCustomerId(user.id)
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

      const isUpgrade = Boolean(
        (availableUpgrade || upgradeFromPurchase?.status === 'Restricted') &&
          upgradeFromPurchase,
      )

      const TWELVE_FOUR_HOURS_FROM_NOW = Math.floor(
        add(new Date(), {hours: 12}).getTime() / 1000,
      )

      if (isUpgrade && upgradeFromPurchase && loadedProduct && customerId) {
        const fixedDiscountForUpgrade = upgradeFromPurchase
          ? await getFixedDiscountForUpgrade({
              upgradeProductId: upgradeFromPurchase.productId,
            })
          : 0

        const fullPrice = loadedProduct.prices?.[0].unitAmount.toNumber()
        const calculatedPrice = getCalculatedPriced({
          unitPrice: fullPrice,
          percentOfDiscount: stripeCouponPercentOff || 0,
          quantity: 1,
          fixedDiscount: fixedDiscountForUpgrade,
        })

        const upgradeFromRegionRestriction =
          upgradeFromPurchase?.status === 'Restricted'
        const couponName = upgradeFromRegionRestriction
          ? `Unrestricted`
          : `Upgrade from ${upgradeFromPurchase.product.name}`

        const coupon = await stripe.coupons.create({
          amount_off: (fullPrice - calculatedPrice) * 100,
          name: couponName,
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
        // no ppp for bulk purchases
        const isNotPPP = merchantCoupon.type !== 'ppp'
        if (isNotPPP || quantity === 1) {
          const {id} = await stripe.promotionCodes.create({
            coupon: merchantCoupon.identifier,
            max_redemptions: 1,
            expires_at: TWELVE_FOUR_HOURS_FROM_NOW,
          })
          discounts.push({
            promotion_code: id,
          })
        }
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

      const metadata = {
        ...(Boolean(availableUpgrade && upgradeFromPurchase) && {
          upgradeFromPurchaseId: upgradeFromPurchaseId as string,
        }),
        bulk: bulk === 'true' ? 'true' : quantity > 1 ? 'true' : 'false',
        country:
          (req.headers['x-vercel-ip-country'] as string) ||
          process.env.DEFAULT_COUNTRY ||
          'US',
        ip_address,
      }

      const session = await stripe.checkout.sessions.create({
        discounts,
        line_items: [
          {
            price,
            quantity: Number(quantity),
          },
        ],
        expires_at: TWELVE_FOUR_HOURS_FROM_NOW,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        ...(customerId && {customer: customerId}),
        metadata,
        payment_intent_data: {
          metadata,
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
