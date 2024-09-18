import {Inngest, EventSchemas} from 'inngest'
import {
  STRIPE_CHECKOUT_COMPLETED_EVENT,
  STRIPE_WEBHOOK_RECEIVED_EVENT,
  type StripeCheckoutCompleted,
  type StripeWebhookReceived,
} from '@skillrecordings/inngest'
import {
  SANITY_WEBHOOK_EVENT,
  SanityWebhookEvent,
} from './functions/sanity/sanity-inngest-events'
import {
  LESSON_COMPLETED_EVENT,
  type LessonCompleted,
  PURCHASE_TRANSFERRED_EVENT,
  PurchaseTransferred,
} from '@skillrecordings/skill-lesson/inngest/events'
import {
  CONVERTKIT_WEBHOOK_EVENT,
  ConvertkitWebhookEvent,
} from '@/inngest/functions/create-custom-coupon'
import {
  EMAIL_WRITING_REQUEST_COMPLETED_EVENT,
  EMAIL_WRITING_REQUESTED_EVENT,
  EmailWritingRequestCompleted,
  EmailWritingRequested,
} from '@/inngest/events'

export type IngestEvents = {
  [STRIPE_CHECKOUT_COMPLETED_EVENT]: StripeCheckoutCompleted
  [STRIPE_WEBHOOK_RECEIVED_EVENT]: StripeWebhookReceived
  [SANITY_WEBHOOK_EVENT]: SanityWebhookEvent
  [PURCHASE_TRANSFERRED_EVENT]: PurchaseTransferred
  [LESSON_COMPLETED_EVENT]: LessonCompleted
  [EMAIL_WRITING_REQUESTED_EVENT]: EmailWritingRequested
  [EMAIL_WRITING_REQUEST_COMPLETED_EVENT]: EmailWritingRequestCompleted
  [CONVERTKIT_WEBHOOK_EVENT]: ConvertkitWebhookEvent
}
export const inngest = new Inngest({
  id: process.env.INNGEST_APP_NAME || process.env.NEXT_PUBLIC_SITE_TITLE,
  schemas: new EventSchemas().fromRecord<IngestEvents>(),
})
