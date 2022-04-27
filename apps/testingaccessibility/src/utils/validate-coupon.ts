import {isBefore} from 'date-fns'

export const validateCoupon = (coupon: any) => {
  const isUsedUp =
    coupon.max_uses > 0 ? coupon.used_count > coupon.max_uses : false

  const isExpired = coupon.expires
    ? isBefore(new Date(coupon.expires), new Date())
    : false

  return {
    isExpired,
    isUsedUp,
    isValid: !isExpired && !isUsedUp,
  }
}
