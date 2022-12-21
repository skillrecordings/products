import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {getSdk, Purchase} from '@skillrecordings/database'
import {
  formatPricesForProduct,
  getActiveMerchantCoupon,
} from '@skillrecordings/commerce-server'
import {find} from 'lodash'
import type {FormattedPrice} from '@skillrecordings/commerce-server/dist/@types'

const merchantCouponSchema = z.object({
  id: z.string(),
  type: z.string(),
})

const PurchaseSchema: z.ZodType<Purchase> = z.any()

const PricingFormattedInputSchema = z.object({
  productId: z.string(),
  userId: z.string().optional(),
  quantity: z.number(),
  couponId: z.string().optional(),
  merchantCoupon: merchantCouponSchema.optional(),
  upgradeFromPurchaseId: z.string().optional(),
  code: z.string().optional(),
  purchases: PurchaseSchema.array(),
})

const checkForAnyAvailableUpgrades = async ({
  upgradeFromPurchaseId,
  productId,
  purchases,
}: {
  upgradeFromPurchaseId: string | undefined
  productId: string
  purchases: Purchase[]
}) => {
  if (upgradeFromPurchaseId) return upgradeFromPurchaseId

  const {availableUpgradesForProduct} = getSdk()

  const availableUpgrades = await availableUpgradesForProduct(
    purchases,
    productId,
  )

  return find(purchases, (purchase) => {
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
  code,
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
    const {activeMerchantCoupon, defaultCoupon} = await getActiveMerchantCoupon(
      {
        siteCouponId: couponId,
        code,
        productId,
      },
    )

    const minimalDefaultCoupon = defaultCoupon && {
      expires: defaultCoupon.expires?.toISOString(),
      percentageDiscount: defaultCoupon.percentageDiscount.toString(),
    }

    return {activeMerchantCoupon, defaultCoupon: minimalDefaultCoupon}
  }
}

export const pricing = createRouter().query('formatted', {
  input: PricingFormattedInputSchema,
  async resolve({ctx, input}): Promise<FormattedPrice> {
    const {
      productId,
      userId,
      quantity,
      couponId,
      merchantCoupon,
      purchases,
      upgradeFromPurchaseId: _upgradeFromPurchaseId,
      code,
    } = input

    const country = (ctx.req.headers['x-vercel-ip-country'] as string) || 'US'

    const upgradeFromPurchaseId = await checkForAnyAvailableUpgrades({
      upgradeFromPurchaseId: _upgradeFromPurchaseId,
      productId,
      purchases,
    })

    const {activeMerchantCoupon, defaultCoupon} =
      await checkForAvailableCoupons({
        merchantCoupon,
        couponId,
        code,
        productId,
      })

    const productPrices = await formatPricesForProduct({
      productId,
      country,
      quantity,
      code,
      merchantCouponId: activeMerchantCoupon?.id,
      ...(upgradeFromPurchaseId && {upgradeFromPurchaseId}),
      userId,
    })

    const formattedPrice = {
      ...productPrices,
      ...(defaultCoupon && {defaultCoupon}),
    }

    return formattedPrice
  },
})
