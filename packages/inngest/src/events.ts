import {type Purchase} from '@skillrecordings/database'
import {type PurchaseInfo} from '@skillrecordings/commerce-server'
export const STRIPE_CHECKOUT_COMPLETED_EVENT =
  'stripe/checkout.session.completed'

export type StripeCheckoutCompleted = {
  name: typeof STRIPE_CHECKOUT_COMPLETED_EVENT
  data: {
    purchase: Purchase
    purchaseInfo: PurchaseInfo
  }
}
