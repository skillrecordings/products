import {SkillRecordingsHandlerParams} from '../types'
import {OutgoingResponse} from '../index'
import {find} from 'lodash'
import {getSdk, Purchase} from '@skillrecordings/database'
import {
  getActiveMerchantCoupon,
  formatPricesForProduct,
  getValidPurchases,
} from '@skillrecordings/commerce-server'

type OptionsForFormatPrices = {
  productId: string
  userId?: string
  country: string
  quantity: number
  siteCouponId?: string
  merchantCouponId?: string
  upgradeFromPurchaseId?: string
  purchases: Purchase[]
  autoApplyPPP: boolean
}

export const formatPrices = async (options: OptionsForFormatPrices) => {
  const {
    userId,
    country,
    productId,
    quantity,
    siteCouponId,
    merchantCouponId,
    upgradeFromPurchaseId: _upgradeFromPurchaseId,
    purchases,
    autoApplyPPP = true,
  } = options

  const {availableUpgradesForProduct} = getSdk()

  const availableUpgrades = await availableUpgradesForProduct(
    purchases,
    productId,
  )

  const upgradeFromPurchaseId = _upgradeFromPurchaseId
    ? _upgradeFromPurchaseId
    : find(getValidPurchases(purchases), (purchase) => {
        const upgradeProductIds = availableUpgrades.map(
          (upgrade) => upgrade.upgradableFrom.id,
        )
        return upgradeProductIds.includes(purchase.productId)
      })?.id

  // explicit incoming merchant coupons are honored
  // without checking for other potential coupons
  // if there is no explicit incoming merchant coupon
  // we check for default/global coupon or an incoming code
  const {activeMerchantCoupon, defaultCoupon} = merchantCouponId
    ? {
        activeMerchantCoupon: {id: merchantCouponId},
        defaultCoupon: false,
      }
    : await getActiveMerchantCoupon({
        siteCouponId,
        code: undefined,
        productId,
      })

  if (quantity > 100) throw new Error(`contact-for-pricing`)

  const product = await formatPricesForProduct({
    productId,
    country,
    quantity,
    merchantCouponId: activeMerchantCoupon?.id,
    ...(upgradeFromPurchaseId && {upgradeFromPurchaseId}),
    userId,
    autoApplyPPP,
  })

  return {product, defaultCoupon}
}

export async function loadPrices({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const {req, token} = params
    const userId = token?.sub

    const country = (req.headers['x-vercel-ip-country'] as string) || 'US'

    // coerce `autoApplyPPP` to true unless it is explicitly false
    const autoApplyPPP =
      req.body.autoApplyPPP === false || req.body.autoApplyPPP === 'false'
        ? false
        : true

    const options: OptionsForFormatPrices = {
      userId,
      country,
      productId: req.body.productId,
      quantity: req.body.quantity,
      purchases: req.body.purchases,
      merchantCouponId: req.body.merchantCouponId,
      siteCouponId: req.body.siteCouponId,
      upgradeFromPurchaseId: req.body.upgradeFromPurchaseId,
      autoApplyPPP,
    }

    const {product, defaultCoupon} = await formatPrices(options)

    return {
      status: 200,
      body: {...product, ...(defaultCoupon && {defaultCoupon})},
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
