import {SkillRecordingsHandlerParams} from '../types'
import {OutgoingResponse} from '../index'
import {find} from 'lodash'
import {getSdk} from '@skillrecordings/database'
import {
  getActiveMerchantCoupon,
  formatPricesForProduct,
} from '@skillrecordings/commerce-server'

export async function loadPrices({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const {req} = params

    const {availableUpgradesForProduct} = getSdk()

    const country = (req.headers['x-vercel-ip-country'] as string) || 'US'

    const {
      code,
      quantity,
      productId,
      merchantCouponId,
      purchases,
      siteCouponId,
    } = req.body

    const availableUpgrades = await availableUpgradesForProduct(
      purchases,
      productId,
    )

    const upgradeFromPurchaseId = req.body.upgradeFromPurchaseId
      ? req.body.upgradeFromPurchaseId
      : purchases &&
        find(purchases, (purchase) => {
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
          code,
          productId,
        })

    if (quantity > 100) throw new Error(`contact-for-pricing`)

    const product = await formatPricesForProduct({
      productId,
      country,
      quantity,
      code,
      merchantCouponId: activeMerchantCoupon && activeMerchantCoupon.id,
      ...(upgradeFromPurchaseId && {upgradeFromPurchaseId}),
    })

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
