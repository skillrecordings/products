export const PURCHASE_STATUS_UPDATED_EVENT = 'commerce/update-purchase-status'

export type PurchaseStatusUpdated = {
  name: typeof PURCHASE_STATUS_UPDATED_EVENT
  data: PurchaseStatusUpdatedEvent
}

export type PurchaseStatusUpdatedEvent = {
  stripeChargeId: string
  status: 'Valid' | 'Refunded' | 'Disputed' | 'Banned' | 'Restricted'
}

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

export const NEW_PURCHASE_CREATED_EVENT = 'commerce/new-purchase-created'

export type NewPurchaseCreated = {
  name: typeof NEW_PURCHASE_CREATED_EVENT
  data: NewPurchaseCreatedEvent
}

export type NewPurchaseCreatedEvent = {
  purchaseId: string
  checkoutSessionId: string
}
