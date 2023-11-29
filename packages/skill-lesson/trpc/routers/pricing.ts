import {z} from 'zod'
import {getSdk} from '@skillrecordings/database'
import {
  formatPricesForProduct,
  getActiveMerchantCoupon,
  getCouponForCode,
  getValidPurchases,
  propsForCommerce,
} from '@skillrecordings/commerce-server'
import {find} from 'lodash'
import {publicProcedure, router} from '../trpc.server'
import {getActiveProducts, getAllProducts} from '../../lib/products'
import {getToken} from 'next-auth/jwt'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'

const merchantCouponSchema = z.object({
  id: z.string(),
  type: z.string().nullable(),
})

const PricingFormattedInputSchema = z.object({
  productId: z.string(),
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
  country,
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
      return !productIdsAlreadyPurchased.includes(
        availableUpgrade.upgradableTo.id,
      )
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

      const token = await getToken({req: ctx.req})

      const verifiedUserId = token?.sub

      const {getPurchasesForUser} = getSdk()
      const purchases = getValidPurchases(
        await getPurchasesForUser(verifiedUserId),
      )

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

      console.log({activeMerchantCoupon, defaultCoupon, usedCouponId})

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

      const formattedPrice = {
        ...productPrices,
        ...(defaultCoupon && {defaultCoupon}),
      }

      return formattedPrice
    }),
  defaultCoupon: publicProcedure.query(async ({ctx}) => {
    const token = await getToken({req: ctx.req})
    const verifiedUserId = token?.sub

    const {getDefaultCoupon, getPurchasesForUser} = getSdk()
    const purchases = getValidPurchases(
      await getPurchasesForUser(verifiedUserId),
    )
    const products = await getAllProducts()
    const defaultCoupons = !token
      ? await getDefaultCoupon(
          products.map((product: SanityProduct) => product.productId),
        )
      : null

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
