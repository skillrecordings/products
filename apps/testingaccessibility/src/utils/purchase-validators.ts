import {Coupon} from '@prisma/client'
import {isNull, isUndefined, some} from 'lodash'

export function bulkCouponHasSeats(coupon: Coupon) {
  return coupon && coupon.usedCount < coupon.maxUses
}

export function hasBulkPurchase(purchases?: any[]) {
  return some(purchases, (purchase) => {
    return !isNull(purchase.bulkCoupon)
  })
}

export function hasAvailableSeats(purchases?: any[]) {
  return some(purchases, (purchase) => {
    return (
      !isNull(purchase.bulkCoupon) && bulkCouponHasSeats(purchase.bulkCoupon)
    )
  })
}

export function hasValidPurchase(purchases?: any[]) {
  return some(purchases, (purchase) => {
    return isNull(purchase.bulkCoupon) || isUndefined(purchase.bulkCoupon)
  })
}
