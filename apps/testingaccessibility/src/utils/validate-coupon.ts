import {isBefore} from 'date-fns'
import {Coupon} from '@prisma/client'

export const validateCoupon = (coupon: Coupon) => {
  const isUsedUp =
    coupon.maxUses > 0 ? coupon.usedCount > coupon.maxUses : false

  const isExpired = coupon.expires
    ? isBefore(new Date(coupon.expires), new Date())
    : false

  const isValid = !isUsedUp && !isExpired

  return {
    isExpired,
    isUsedUp,
    isRedeemable: isValid && coupon.percentageDiscount.toNumber() >= 1,
    isValid,
  }
}
