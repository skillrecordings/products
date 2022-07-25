import {Coupon} from '../../generated/prisma/client'

export function couponIsValid(coupon?: Coupon | null) {
  if (coupon) {
    const unlimitedUse = coupon.maxUses === -1
    if (!unlimitedUse && coupon.usedCount >= coupon.maxUses) return false
    if (coupon.expires && coupon.expires < new Date()) return false
  } else {
    return false
  }

  return true
}
