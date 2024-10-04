import {OutgoingResponse} from '../index'
import {SkillRecordingsHandlerParams} from '../types'
import {
  Product,
  Purchase,
  UpgradableProducts,
  getSdk,
  prisma,
} from '@skillrecordings/database'
import {first, isEmpty} from 'lodash'
import {add} from 'date-fns'
import {
  getCalculatedPrice,
  getFixedDiscountForIndividualUpgrade,
} from '@skillrecordings/commerce-server'
import {getToken} from 'next-auth/jwt'
import {NextApiRequest} from 'next'
import {z} from 'zod'
import {SkillRecordingsOptions} from '../../next'
import {
  defaultContext as defaultStripeContext,
  Stripe,
} from '@skillrecordings/stripe-sdk'

const {stripe: defaultStripe} = defaultStripeContext

const buildSearchParams = (params: object) => {
  // implementing this instead of using `URLSearchParams` because that API
  // does URL encoding of values in the URL like the curly braces in
  // `session_id={CHECKOUT_SESSION_ID}` which needs to get passed to stripe
  // as is.
  if (isEmpty(params)) {
    return ''
  } else {
    const paramsAsString = Object.entries(params)
      .map(([key, value]) => {
        return `${key}=${value}`
      })
      .join('&')

    return paramsAsString
  }
}

/**
 * Given a specific user we want to lookup their Stripe
 * customer ID and if one doesn't exist we will
 * create it.
 * @param userId
 */
async function findOrCreateStripeCustomerId(userId: string, stripe: Stripe) {
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
        ? first(
            user.merchantCustomers.filter(
              (mc) => !mc.identifier.startsWith('no_stripe_customer_id'),
            ),
          )?.identifier
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

const buildCouponNameWithProductName = (
  pre: string,
  productName: string,
  post: string,
): string => {
  // Calculate the total length without the ellipsis
  const totalLength = pre.length + productName.length + post.length

  // If total length exceeds 40 characters
  if (totalLength > 40) {
    // Calculate the number of characters to truncate from productName
    const excess = totalLength - 40 + 3 // 3 is for the length of ellipsis "..."
    productName = productName.slice(0, -excess) + '...'
  }

  // Return the concatenated string
  return pre + productName + post
}

const buildCouponName = (
  upgradeFromPurchase:
    | (Purchase & {
        product: Product
      })
    | null,
  productId: string,
  availableUpgrade: UpgradableProducts | null,
  purchaseWillBeRestricted: boolean,
  stripeCouponPercentOff: number,
) => {
  let couponName = null

  if (
    upgradeFromPurchase?.status === 'Restricted' &&
    !purchaseWillBeRestricted &&
    upgradeFromPurchase.productId === productId
  ) {
    // if its the same productId and we are going from PPP to Unrestricted
    couponName = 'Unrestricted'
  } else if (availableUpgrade && upgradeFromPurchase?.status === 'Valid') {
    // if there is an availableUpgrade (e.g. Core -> Bundle) and the original purchase wasn't region restricted
    couponName = buildCouponNameWithProductName(
      'Upgrade from ',
      upgradeFromPurchase.product.name,
      '',
    )
  } else if (
    availableUpgrade &&
    upgradeFromPurchase?.status === 'Restricted' &&
    purchaseWillBeRestricted
  ) {
    // if there is an availableUpgrade (e.g. Core -> Bundle) and we are staying PPP
    // betterCouponName = `Upgrade from ${
    //   upgradeFromPurchase.product.name
    // } + PPP ${stripeCouponPercentOff * 100}% off`
    couponName = buildCouponNameWithProductName(
      'Upgrade from ',
      upgradeFromPurchase.product.name,
      ` + PPP ${Math.floor(stripeCouponPercentOff * 100)}% off`,
    )
  } else if (
    availableUpgrade &&
    upgradeFromPurchase?.status === 'Restricted' &&
    !purchaseWillBeRestricted
  ) {
    // if there is an availableUpgrade (e.g. Core -> Bundle) and we are going from PPP to Unrestricted
    // couponName = `Unrestricted Upgrade from ${upgradeFromPurchase.product.name}`
    couponName = buildCouponNameWithProductName(
      'Unrestricted Upgrade from ',
      upgradeFromPurchase.product.name,
      '',
    )
  } else {
    // we don't expect to hit this case
    couponName = 'Discount'
  }

  return couponName
}

const LoadedProductSchema = z.object({
  id: z.string(),
  merchantProducts: z
    .array(
      z.object({
        identifier: z.string(),
        merchantPrices: z
          .array(
            z.object({
              identifier: z.string(),
            }),
          )
          .nonempty({message: 'MerchantPrice is missing'}),
      }),
    )
    .nonempty({message: 'MerchantProduct is missing'}),
})

export async function stripeCheckout({
  params,
  options,
}: {
  params: SkillRecordingsHandlerParams
  options: SkillRecordingsOptions
}): Promise<OutgoingResponse> {
  try {
    const {req} = params
    const token = await getToken({req: req as unknown as NextApiRequest})

    const ip_address = req.headers['x-forwarded-for'] as string

    let errorRedirectUrl: string | undefined = undefined

    const stripe =
      options.paymentOptions?.providers.stripe?.paymentClient || defaultStripe

    if (!stripe) {
      throw new Error('Stripe client is missing')
    }

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
        usedCouponId,
      } = req.query

      errorRedirectUrl = req.query.errorRedirectUrl

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
          : null

      const customerId = user
        ? await findOrCreateStripeCustomerId(user.id, stripe)
        : false

      const loadedProduct = await prisma.product.findFirst({
        where: {id: productId as string},
        include: {
          prices: true,
          merchantProducts: {
            where: {
              status: 1,
            },
            include: {
              merchantPrices: {
                where: {
                  status: 1,
                },
              },
            },
          },
        },
      })

      const result = LoadedProductSchema.safeParse(loadedProduct)

      if (!result.success) {
        const errorMessages = result.error.errors
          .map((err) => err.message)
          .join(', ')

        // Send `errorMessages` to Sentry so we can deal with it right away.
        console.log(`No product (${productId}) was found (${errorMessages})`)

        throw new CheckoutError(
          `No product was found`,
          String(loadedProduct?.id),
          couponId as string,
        )
      }

      const loadedProductData = result.data

      const merchantProductIdentifier =
        loadedProductData.merchantProducts[0].identifier
      const merchantPriceIdentifier =
        loadedProductData.merchantProducts[0].merchantPrices[0].identifier

      const merchantCoupon = couponId
        ? await getMerchantCoupon({
            where: {
              id: couponId as string,
            },
          })
        : null

      const stripeCoupon =
        merchantCoupon && merchantCoupon.identifier
          ? await stripe.coupons.retrieve(merchantCoupon.identifier)
          : false

      const stripeCouponPercentOff =
        stripeCoupon && stripeCoupon.percent_off
          ? stripeCoupon.percent_off / 100
          : 0

      let discounts = []
      let appliedPPPStripeCouponId: string | undefined | null = undefined
      let upgradedFromPurchaseId: string | undefined | null = undefined

      const isUpgrade = Boolean(
        (availableUpgrade || upgradeFromPurchase?.status === 'Restricted') &&
          upgradeFromPurchase,
      )

      const TWELVE_FOUR_HOURS_FROM_NOW = Math.floor(
        add(new Date(), {hours: 12}).getTime() / 1000,
      )

      if (isUpgrade && upgradeFromPurchase && loadedProduct && customerId) {
        const purchaseWillBeRestricted = merchantCoupon?.type === 'ppp'
        appliedPPPStripeCouponId = merchantCoupon?.identifier
        upgradedFromPurchaseId = upgradeFromPurchase.id

        const fixedDiscountForIndividualUpgrade =
          await getFixedDiscountForIndividualUpgrade({
            purchaseToBeUpgraded: upgradeFromPurchase,
            productToBePurchased: loadedProduct,
            purchaseWillBeRestricted,
            userId,
          })

        const fullPrice = loadedProduct.prices?.[0].unitAmount.toNumber()
        const calculatedPrice = getCalculatedPrice({
          unitPrice: fullPrice,
          percentOfDiscount: stripeCouponPercentOff || 0,
          quantity: 1,
          fixedDiscount: fixedDiscountForIndividualUpgrade,
        })

        if (fixedDiscountForIndividualUpgrade > 0) {
          const couponName = buildCouponName(
            upgradeFromPurchase,
            productId,
            availableUpgrade,
            purchaseWillBeRestricted,
            stripeCouponPercentOff,
          )

          const amount_off_in_cents = Math.round(
            (fullPrice - calculatedPrice) * 100,
          )

          const coupon = await stripe.coupons.create({
            amount_off: amount_off_in_cents,
            name: couponName,
            max_redemptions: 1,
            redeem_by: TWELVE_FOUR_HOURS_FROM_NOW,
            currency: 'USD',
            applies_to: {
              products: [merchantProductIdentifier],
            },
          })

          discounts.push({
            coupon: coupon.id,
          })
        }
      } else if (merchantCoupon && merchantCoupon.identifier) {
        // no ppp for bulk purchases
        const isNotPPP = merchantCoupon.type !== 'ppp'
        if (isNotPPP || quantity === 1) {
          appliedPPPStripeCouponId =
            merchantCoupon.type === 'ppp'
              ? merchantCoupon?.identifier
              : undefined
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

      let successUrl: string = (() => {
        const baseQueryParams = {
          session_id: '{CHECKOUT_SESSION_ID}',
          provider: 'stripe',
        }

        if (isUpgrade) {
          const queryParamString = buildSearchParams({
            ...baseQueryParams,
            upgrade: 'true',
          })
          const url = `${process.env.NEXT_PUBLIC_URL}/welcome?${queryParamString}`

          return url
        } else {
          const queryParamString = buildSearchParams(baseQueryParams)

          const url = `${process.env.NEXT_PUBLIC_URL}/thanks/purchase?${queryParamString}`
          return url
        }
      })()

      const metadata = {
        ...(Boolean(availableUpgrade && upgradeFromPurchase) && {
          upgradeFromPurchaseId: upgradeFromPurchaseId as string,
        }),
        bulk: bulk === 'true' ? 'true' : quantity > 1 ? 'true' : 'false',
        ...(appliedPPPStripeCouponId && {appliedPPPStripeCouponId}),
        ...(upgradedFromPurchaseId && {upgradedFromPurchaseId}),
        country:
          (req.headers['x-vercel-ip-country'] as string) ||
          process.env.DEFAULT_COUNTRY ||
          'US',
        ip_address,
        ...(usedCouponId && {usedCouponId}),
        productId: loadedProduct.id,
        product: loadedProduct.name,
        ...(user && {userId: user.id}),
        siteName: process.env.NEXT_PUBLIC_APP_NAME,
      }

      const session = await stripe.checkout.sessions.create({
        discounts,
        line_items: [
          {
            price: merchantPriceIdentifier,
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
      if (errorRedirectUrl) {
        return {
          redirect: errorRedirectUrl,
          status: 303,
        }
      }

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
