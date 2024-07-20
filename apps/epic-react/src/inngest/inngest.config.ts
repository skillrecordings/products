import {inngest} from '@/inngest/inngest.server'
import {purchaseTransferComplete} from '@/inngest/functions/purchase/purchase-transfer-complete'
import {stripeCheckoutCompleted} from '@/inngest/functions/stripe/checkout-completed'
import {sanityProductFunctions} from '@/inngest/functions/sanity/product'
import {stripeWebhookReceived} from '@/inngest/functions/stripe/webhook-received'
import {convertkitWebhookHandler} from '@/inngest/functions/create-custom-coupon'

export const inngestConfig = {
  client: inngest,
  functions: [
    stripeCheckoutCompleted,
    stripeWebhookReceived,
    purchaseTransferComplete,
    convertkitWebhookHandler,
    ...sanityProductFunctions,
  ],
}
