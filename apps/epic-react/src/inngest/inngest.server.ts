import {Inngest, EventSchemas} from 'inngest'
import {
  STRIPE_CHECKOUT_COMPLETED_EVENT,
  STRIPE_WEBHOOK_RECEIVED_EVENT,
  type StripeCheckoutCompleted,
  type StripeWebhookReceived,
} from '@skillrecordings/inngest'

export type IngestEvents = {
  [STRIPE_CHECKOUT_COMPLETED_EVENT]: StripeCheckoutCompleted
  [STRIPE_WEBHOOK_RECEIVED_EVENT]: StripeWebhookReceived
}
export const inngest = new Inngest({
  id: process.env.INNGEST_APP_NAME || process.env.NEXT_PUBLIC_SITE_TITLE,
  schemas: new EventSchemas().fromRecord<IngestEvents>(),
})
