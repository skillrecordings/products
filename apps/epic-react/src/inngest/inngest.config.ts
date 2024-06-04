import {inngest} from '@/inngest/inngest.server'
import {stripeCheckoutCompleted} from '@/inngest/functions/stripe/checkout-completed'
import {stripeWebhookReceived} from '@/inngest/functions/stripe/webhook-received'

export const inngestConfig = {
  client: inngest,
  functions: [stripeCheckoutCompleted, stripeWebhookReceived],
}
