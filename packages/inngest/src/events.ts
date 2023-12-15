export const STRIPE_CHECKOUT_COMPLETED_EVENT =
  'stripe/checkout.session.completed'

export type StripeCheckoutCompleted = {
  name: typeof STRIPE_CHECKOUT_COMPLETED_EVENT
  data: {
    purchaseId: string
    productId: string
    quantity: number
    created: number
  }
}

export const BULK_PURCHASE_COUPON_REDEEMED =
  'purchase/bulk.purchase.coupon.redeemed'

export type BulkPurchaseCouponRedeemed = {
  name: typeof BULK_PURCHASE_COUPON_REDEEMED
  data: {
    purchaseId: string
    productId: string
    bulkCouponUsedId: string
  }
}
