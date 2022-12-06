import {isBefore} from 'date-fns'
import {Coupon} from '@skillrecordings/database'

export const validateCoupon = (coupon: Coupon | null) => {
  if (!coupon) {
    return {
      isValid: false,
      isRedeemable: false,
      error: 'coupon-not-found',
    }
  }

  const isUsedUp =
    coupon.maxUses > 0 ? coupon.usedCount >= coupon.maxUses : false

  const isExpired = coupon.expires
    ? isBefore(new Date(coupon.expires), new Date())
    : false

  const isValid = !isUsedUp && !isExpired

  return {
    isExpired,
    isUsedUp,
    isRedeemable:
      isValid && coupon.percentageDiscount.toNumber() >= 1 && !coupon.default,
    isValid,
  }
}
