import {inngest} from '@/inngest/inngest.server'
import {purchaseTransferComplete} from '@/inngest/functions/purchase/purchase-transfer-complete'
import {stripeCheckoutCompleted} from '@/inngest/functions/stripe/checkout-completed'
import {sanityProductFunctions} from '@/inngest/functions/sanity/product'
import {stripeWebhookReceived} from '@/inngest/functions/stripe/webhook-received'

export const inngestConfig = {
  client: inngest,
  functions: [
    stripeCheckoutCompleted,
    stripeWebhookReceived,
    purchaseTransferComplete,
    ...sanityProductFunctions,
  ],
}
