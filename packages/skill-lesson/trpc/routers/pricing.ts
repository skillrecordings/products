import {z} from 'zod'
import {getSdk} from '@skillrecordings/database'
import {
  formatPricesForProduct,
  getActiveMerchantCoupon,
  getValidPurchases,
  propsForCommerce,
} from '@skillrecordings/commerce-server'
import {find} from 'lodash'
import {publicProcedure, router} from '../trpc.server'
import {getActiveProducts, getAllProducts} from '../../lib/products'
import {getToken} from 'next-auth/jwt'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {User, UserSchema} from '../../utils/ability'
import {Subscriber, SubscriberSchema} from '../../schemas/subscriber'
import {fetchSubscriber} from '@skillrecordings/convertkit-sdk'
import {serialize} from 'cookie'

const merchantCouponSchema = z.object({
  id: z.string(),
  type: z.string().nullable(),
})

const PricingFormattedInputSchema = z.object({
  productId: z.string().optional(),
  quantity: z.number(),
  couponId: z.string().optional(),
  merchantCoupon: merchantCouponSchema.optional(),
  upgradeFromPurchaseId: z.string().optional(),
  autoApplyPPP: z.boolean().default(false),
})

const checkForAnyAvailableUpgrades = async ({
  upgradeFromPurchaseId,
  productId,
  purchases,
}: {
  upgradeFromPurchaseId: string | undefined
  productId: string
  purchases: Array<{id: string; productId: string; status: string}>
  country: string
}) => {
  if (upgradeFromPurchaseId) return upgradeFromPurchaseId

  const {availableUpgradesForProduct} = getSdk()
  const validPurchases = getValidPurchases(purchases)
  const productIdsAlreadyPurchased = validPurchases.map(
    (purchase) => purchase.productId,
  )
  const productsAlreadyUpgradedFrom = validPurchases
    .map((purchase) => {
      if (!purchase.upgradedFromId) return null

      const upgradedFromPurchase = validPurchases.find(
        (innerPurchase) => innerPurchase.id === purchase.upgradedFromId,
      )
      if (!upgradedFromPurchase) return null

      return upgradedFromPurchase.productId
    })
    .filter((id): id is string => Boolean(id))

  const potentialUpgrades = await availableUpgradesForProduct(
    validPurchases,
    productId,
  )

  type AvailableUpgrade = Awaited<
    ReturnType<typeof availableUpgradesForProduct>
  >[0]
  // filter out potential upgrades that have already been purchased
  const availableUpgrades = potentialUpgrades.filter<AvailableUpgrade>(
    (
      availableUpgrade: AvailableUpgrade,
    ): availableUpgrade is AvailableUpgrade => {
      const alreadyPurchased = productIdsAlreadyPurchased.includes(
        availableUpgrade.upgradableTo.id,
      )

      // filter out upgrade paths that are no longer available.
      //
      // for instance, if a user has already done an upgrade purchase from
      // `Basic` to `Standard`, then we would no longer want to offer the
      // `Basic` to `Pro` upgrade path. Only the `Standard` to `Pro` should
      // be available at that point.
      const alreadyUpgradedFrom = productsAlreadyUpgradedFrom.includes(
        availableUpgrade.upgradableFrom.id,
      )

      return !alreadyPurchased && !alreadyUpgradedFrom
    },
  )

  return find(validPurchases, (purchase) => {
    const upgradeProductIds = availableUpgrades.map(
      (upgrade) => upgrade.upgradableFrom.id,
    )
    return upgradeProductIds.includes(purchase.productId)
  })?.id
}

const CheckForAvailableCouponsSchema = PricingFormattedInputSchema.pick({
  merchantCoupon: true,
  couponId: true,
  code: true,
  productId: true,
})
type CheckForAvailableCoupons = z.infer<typeof CheckForAvailableCouponsSchema>

const checkForAvailableCoupons = async ({
  merchantCoupon,
  couponId,
  productId,
}: CheckForAvailableCoupons) => {
  // explicit incoming merchant coupons are honored
  // without checking for other potential coupons
  // if there is no explicit incoming merchant coupon
  // we check for default/global coupon or an incoming code
  if (merchantCoupon?.id) {
    return {
      activeMerchantCoupon: merchantCoupon,
      defaultCoupon: undefined,
    }
  } else {
    const {activeMerchantCoupon, defaultCoupon, usedCouponId} =
      await getActiveMerchantCoupon({
        siteCouponId: couponId,
        productId,
        code: undefined,
      })

    const minimalDefaultCoupon = defaultCoupon && {
      expires: defaultCoupon.expires?.toISOString(),
      percentageDiscount: defaultCoupon.percentageDiscount.toString(),
    }

    return {
      activeMerchantCoupon,
      defaultCoupon: minimalDefaultCoupon,
      usedCouponId,
    }
  }
}

export const pricing = router({
  propsForCommerce: publicProcedure
    .input(
      z.object({
        code: z.string().optional(),
        coupon: z.string().optional(),
        allowPurchase: z.string().optional(),
        productId: z.string().optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      const {products} = await getActiveProducts()

      const {props} = await propsForCommerce({
        query: input,
        token,
        products: input.productId ? [{productId: input.productId}] : products,
      })
      return props
    }),
  formatted: publicProcedure
    .input(PricingFormattedInputSchema)
    .query(async ({ctx, input}) => {
      const {
        productId,
        quantity,
        couponId,
        merchantCoupon,
        upgradeFromPurchaseId: _upgradeFromPurchaseId,
        autoApplyPPP,
      } = input
      const {getPurchasesForUser, getUserByEmail} = getSdk()
      const token = await getToken({req: ctx.req})

      const parsedToken = token && UserSchema.safeParse(token)

      let user: User | null = null
      let subscriber: Subscriber | null = null

      if (parsedToken?.success) {
        user = await getUserByEmail(parsedToken.data.email)
      }

      let rawSubscriber = null

      if (ctx.req.cookies['ck_subscriber']) {
        try {
          rawSubscriber = JSON.parse(ctx.req.cookies['ck_subscriber'])
        } catch (e) {
          console.log('error parsing ck_subscriber cookie', e)
        }
      }

      if (rawSubscriber && rawSubscriber.id) {
        try {
          rawSubscriber = await fetchSubscriber(rawSubscriber.id as string)
        } catch (e) {
          console.log('error fetching ck_subscriber cookie', e)
        }
      }

      const parsedSubscriber = SubscriberSchema.safeParse(rawSubscriber)

      if (parsedSubscriber.success) {
        subscriber = parsedSubscriber.data
        user = user ? user : await getUserByEmail(subscriber.email_address)
        ctx.res.setHeader(
          'Set-Cookie',
          serialize('ck_subscriber', JSON.stringify(deepOmitNull(subscriber)), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 31556952,
          }),
        )
      }

      const verifiedUserId = token?.sub

      const purchases = getValidPurchases(await getPurchasesForUser(user?.id))

      if (!productId) throw new Error('productId is required')

      const country =
        (ctx.req.headers['x-vercel-ip-country'] as string) ||
        process.env.DEFAULT_COUNTRY ||
        'US'

      let upgradeFromPurchaseId = await checkForAnyAvailableUpgrades({
        upgradeFromPurchaseId: _upgradeFromPurchaseId,
        productId,
        purchases,
        country,
      })

      const restrictedPurchase = purchases.find((purchase) => {
        return (
          purchase.productId === productId && purchase.status === 'Restricted'
        )
      })

      if (restrictedPurchase) {
        const validPurchase = purchases.find((purchase) => {
          return purchase.productId === productId && purchase.status === 'Valid'
        })

        if (!validPurchase) {
          upgradeFromPurchaseId = restrictedPurchase.id
        }
      }

      const {activeMerchantCoupon, defaultCoupon, usedCouponId} =
        await checkForAvailableCoupons({
          merchantCoupon,
          couponId,
          productId,
        })

      const productPrices = await formatPricesForProduct({
        productId,
        country,
        quantity,
        merchantCouponId: activeMerchantCoupon?.id,
        ...(upgradeFromPurchaseId && {upgradeFromPurchaseId}),
        userId: user?.id,
        autoApplyPPP,
        usedCouponId,
      })

      return {
        ...productPrices,
        ...(defaultCoupon && {defaultCoupon}),
      }
    }),
  defaultCoupon: publicProcedure.query(async ({ctx}) => {
    const token = await getToken({req: ctx.req})
    const verifiedUserId = token?.sub

    const {getDefaultCoupon, getPurchasesForUser} = getSdk()
    const purchases = getValidPurchases(
      await getPurchasesForUser(verifiedUserId),
    )
    const products = await getAllProducts()
    const defaultCoupons = await getDefaultCoupon(
      products.map((product: SanityProduct) => product.productId),
    )

    const defaultCoupon = defaultCoupons?.defaultCoupon

    const hasPurchasedProductFromDefaultCoupon =
      defaultCoupon &&
      purchases.some((purchase) => {
        return purchase.productId === defaultCoupon.product?.id
      })

    if (!hasPurchasedProductFromDefaultCoupon && defaultCoupon) {
      return defaultCoupon
    }

    return null
  }),
})

function deepOmitNull(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepOmitNull).filter((x) => x !== null)
  }

  if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleaned = deepOmitNull(value)
      if (cleaned !== null) {
        acc[key] = cleaned
      }
      return acc
    }, {} as Record<string, any>)
  }

  return obj === null ? undefined : obj
}
