export function bulkCouponHasSeats(coupon: {
  maxUses: number
  usedCount: number
}) {
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
    return (
      (purchase &&
        !Boolean(purchase.bulkCoupon) &&
        purchase.status === 'Valid') ||
      purchase.status === 'Restricted'
    )
  })
}

export function hasInvoice(purchases?: any[]) {
  return purchases?.some((purchase) => Boolean(purchase.merchantChargeId))
}
