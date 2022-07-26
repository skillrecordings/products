import {Coupon} from '../../generated/prisma/client'
import {isAfter} from 'date-fns'

export function couponIsValid(coupon?: Coupon | null) {
  if (coupon) {
    const unlimitedUse = coupon.maxUses === -1
    const now = new Date()
    if (!unlimitedUse && coupon.usedCount >= coupon.maxUses) return false
    if (coupon.expires && isAfter(now, coupon.expires)) return false
  } else {
    return false
  }
  return true
}
