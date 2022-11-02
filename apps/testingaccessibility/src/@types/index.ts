export type PurchaseWithBulkCoupon = {
  merchantChargeId: string | null
  bulkCoupon: {id: string; maxUses: number; usedCount: number} | null
  product: {id: string; name: string}
}

export type MinimalPurchase = {
  id: string
  product: {id: string; name: string}
}
