import {type PurchaseInfo} from '@skillrecordings/commerce-server'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
export const STRIPE_CHECKOUT_COMPLETED_EVENT =
  'stripe/checkout.session.completed'

export const SYNC_SANITY_PRODUCT = 'sanity/sync.products'

export type StripeCheckoutCompleted = {
  name: typeof STRIPE_CHECKOUT_COMPLETED_EVENT
  data: {
    purchaseId: string
    productId: string
    quantity: number
    created: number
  }
}

export type SanityProductsSyncWithDB = {
  name: typeof SYNC_SANITY_PRODUCT
  data: {
    product: SanityProduct
  }
}
