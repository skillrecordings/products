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
