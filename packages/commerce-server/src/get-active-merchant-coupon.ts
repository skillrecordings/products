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

  const defaultCoupons = await getDefaultCoupon(productId)

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
    const {merchantCoupon: incomingMerchantCoupon} = incomingCoupon
    if (
      incomingMerchantCoupon.percentageDiscount >
      defaultMerchantCoupon.percentageDiscount
    ) {
      activeMerchantCoupon = incomingMerchantCoupon
    } else {
      activeMerchantCoupon = defaultMerchantCoupon
    }
  } else if (
    // if it's a coupon, use it
    incomingCoupon?.merchantCoupon &&
    couponIsValid(incomingCoupon)
  ) {
    activeMerchantCoupon = incomingCoupon.merchantCoupon
  } else if (
    // if a sale is running, use that
    defaultMerchantCoupon
  ) {
    activeMerchantCoupon = defaultMerchantCoupon
  }

  const defaultCoupon = defaultCoupons?.defaultCoupon

  return {
    activeMerchantCoupon,
    ...(defaultCoupon &&
      defaultCoupon.merchantCouponId === activeMerchantCoupon?.id && {
        defaultCoupon,
      }),
  }
}
