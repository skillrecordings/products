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

export const STRIPE_WEBHOOK_RECEIVED_EVENT = 'stripe/webhook.received'

export type StripeWebhookReceived = {
  name: typeof STRIPE_WEBHOOK_RECEIVED_EVENT
  data: {id: string; type: string; data: Record<string, any>}
}
