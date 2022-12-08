import {Coupon} from '@skillrecordings/database'
import {isAfter} from 'date-fns'

/**
 * @deprecated prefer `validateCoupon`
 * @param coupon
 */
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
