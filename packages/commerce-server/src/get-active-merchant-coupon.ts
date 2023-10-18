import {couponIsValid} from './coupon-is-valid'
import {getSdk} from '@skillrecordings/database'

export async function getActiveMerchantCoupon({
  productId,
  siteCouponId,
  code,
}: {
  productId: string | undefined
  siteCouponId: string | undefined
  code: string | undefined
}) {
  const {getDefaultCoupon, couponForIdOrCode} = getSdk()

  let activeMerchantCoupon = null
  let usedCouponId

  const defaultCoupons = productId
    ? await getDefaultCoupon([productId])
    : undefined

  const defaultMerchantCoupon = defaultCoupons
    ? defaultCoupons.defaultMerchantCoupon
    : null

  const incomingCoupon = await couponForIdOrCode({
    couponId: siteCouponId,
    code,
  })

  if (
    // compare the discounts if there is a coupon and site/sale running
    incomingCoupon?.merchantCoupon &&
    couponIsValid(incomingCoupon) &&
    defaultMerchantCoupon
  ) {
    // use whichever coupon provides the bigger discount
    const {merchantCoupon: incomingMerchantCoupon} = incomingCoupon
    if (
      incomingMerchantCoupon.percentageDiscount >=
      defaultMerchantCoupon.percentageDiscount
    ) {
      activeMerchantCoupon = incomingMerchantCoupon
      usedCouponId = incomingCoupon.id
    } else {
      activeMerchantCoupon = defaultMerchantCoupon
      usedCouponId = defaultCoupons?.defaultCoupon?.id
    }
  } else if (
    // if it's a coupon, use it
    incomingCoupon?.merchantCoupon &&
    couponIsValid(incomingCoupon)
  ) {
    activeMerchantCoupon = incomingCoupon.merchantCoupon
    usedCouponId = incomingCoupon.id
  } else if (
    // if a sale is running, use that
    defaultMerchantCoupon
  ) {
    activeMerchantCoupon = defaultMerchantCoupon
    usedCouponId = defaultCoupons?.defaultCoupon?.id
  }

  const defaultCoupon = defaultCoupons?.defaultCoupon

  return {
    usedCouponId,
    activeMerchantCoupon,
    ...(defaultCoupon &&
      defaultCoupon.merchantCouponId === activeMerchantCoupon?.id && {
        defaultCoupon,
      }),
  }
}
