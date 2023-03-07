import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {getSdk, prisma} from '@skillrecordings/database'
import {first} from 'lodash'
import {add} from 'date-fns'
import {getCalculatedPriced, stripe} from '@skillrecordings/commerce-server'
import {getToken} from 'next-auth/jwt'
import {NextApiRequest} from 'next'
import {z} from 'zod'

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
      // TODO: Maybe we should just Zod parse everything coming in and clean
      // up a bunch of type coercion (`as`'s) throughout this file.
      const {userId: _userId} = req.query

      const querySchema = z
        .object({
          productId: z.string(),
          upgradeFromPurchaseId: z.string().optional(),
          userId: z.string().optional(),
          couponId: z.string().optional(),
          quantity: z.number().optional(),
          bulk: z.boolean().default(false),
        })
        .transform(({quantity, userId, ...rest}) => {
          return {
            userId: userId || token?.sub,
            quantity: quantity || 1,
            ...rest,
          }
        })

      const {
        productId,
        upgradeFromPurchaseId,
        userId,
        couponId,
        quantity,
        bulk,
      } = querySchema.parse(req.query)

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          merchantCustomers: true,
        },
      })

      const upgradeFromPurchase = upgradeFromPurchaseId
        ? await prisma.purchase.findFirst({
            where: {
              id: upgradeFromPurchaseId,
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
                upgradableToId: productId,
              },
            })
          : false

      const customerId =
        user && user.merchantCustomers
          ? first(user.merchantCustomers)?.identifier
          : false

      const loadedProduct = await prisma.product.findFirst({
        where: {id: productId},
        include: {
          prices: true,
          merchantProducts: {
            include: {
              merchantPrices: true,
            },
          },
        },
      })

      let merchantCoupon = await getMerchantCoupon({
        where: {
          id: couponId,
        },
      })

      // Null out the `merchantCoupon` if it is a PPP coupon when the
      // quantity is greater than 1. You cannot apply PPP to a purchase
      // of multiple seats.
      if (merchantCoupon?.type === 'ppp' && quantity > 1) {
        // TODO: Let support know that we may have showed a discounted
        // price to a user when we didn't mean to.

        merchantCoupon = null
      }

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

      const TWELVE_HOURS_FROM_NOW = Math.floor(
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

        const upgradeFromRegionRestriction =
          upgradeFromPurchase?.status === 'Restricted'
        const couponName = upgradeFromRegionRestriction
          ? `Unrestricted`
          : `Upgrade from ${upgradeFromPurchase.product.name}`

        const coupon = await stripe.coupons.create({
          amount_off: (fullPrice - calculatedPrice) * 100,
          name: couponName,
          max_redemptions: 1,
          redeem_by: TWELVE_HOURS_FROM_NOW,
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
          expires_at: TWELVE_HOURS_FROM_NOW,
        })
        discounts.push({
          promotion_code: id,
        })
      }

      if (!loadedProduct) {
        throw new CheckoutError('No product was found', productId)
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
          upgradeFromPurchaseId,
        }),
        bulk: Boolean(bulk || quantity > 1).toString(),
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
        expires_at: TWELVE_HOURS_FROM_NOW,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: `${req.headers.origin}/buy`,
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
