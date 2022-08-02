import {Coupon} from '@skillrecordings/database'

export function bulkCouponHasSeats(coupon: Coupon) {
  return coupon && coupon.usedCount < coupon.maxUses
}

export function hasBulkPurchase(purchases?: any[]) {
  return purchases?.some((purchase) => Boolean(purchase.bulkCoupon))
}

export function hasAvailableSeats(purchases?: any[]) {
  return purchases?.some(
    (purchase) =>
      Boolean(purchase.bulkCoupon) && bulkCouponHasSeats(purchase.bulkCoupon),
  )
}

export function hasValidPurchase(purchases?: any[]) {
  return purchases?.some((purchase) => {
    return purchase && !Boolean(purchase.bulkCoupon)
  })
}

export function hasInvoice(purchases?: any[]) {
  return purchases?.some((purchase) => Boolean(purchase.merchantChargeId))
}
