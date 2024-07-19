import {z} from 'zod'
import {getSdk, prisma} from '@skillrecordings/database'
import {
  formatPricesForProduct,
  getActiveMerchantCoupon,
  getCouponForCode,
  getValidPurchases,
  propsForCommerce,
} from '@skillrecordings/commerce-server'
import {find} from 'lodash'
import {publicProcedure, router} from '../trpc.server'
import {
  getActiveProducts,
  getAllActiveProducts,
  getAllProducts,
} from '../../lib/products'
import {getToken} from 'next-auth/jwt'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'

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
  autoApplyPPP: z.boolean().default(true),
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
      const coupon = await prisma.coupon.findFirst({
        where: {
          OR: [
            {
              code: input.code || input.coupon,
            },
            {
              id: input.code || input.coupon,
            },
          ],
        },
        select: {
          restrictedToProductId: true,
        },
      })
      // this doesn't really return "active" products at all
      const {products} = await getActiveProducts()

      const {props} = await propsForCommerce({
        query: input,
        token,
        products: input.productId
          ? [{productId: input.productId}]
          : coupon?.restrictedToProductId // if there is a coupon and its restricted to the product, that's the product
          ? [{productId: coupon.restrictedToProductId}]
          : products,
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

      const token = await getToken({req: ctx.req})

      const verifiedUserId = token?.sub

      const {getPurchasesForUser} = getSdk()
      const purchases = getValidPurchases(
        await getPurchasesForUser(verifiedUserId),
      )

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
        userId: verifiedUserId,
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
