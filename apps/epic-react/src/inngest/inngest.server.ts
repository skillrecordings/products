import {Inngest, EventSchemas} from 'inngest'
import {
  STRIPE_CHECKOUT_COMPLETED_EVENT,
  STRIPE_WEBHOOK_RECEIVED_EVENT,
  type StripeCheckoutCompleted,
  type StripeWebhookReceived,
  NEW_PURCHASE_CREATED_EVENT,
  type NewPurchaseCreated,
  PURCHASE_STATUS_UPDATED_EVENT,
  PurchaseStatusUpdated,
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
  OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT,
  OauthProviderAccountLinked,
} from '@/inngest/events'
import {
  SYNC_CONVERTKIT_PURCHASE_TAGS_EVENT,
  SyncConvertkitPurchaseTags,
} from '@/inngest/functions/sync-convertkit-purchases'

export type IngestEvents = {
  [CONVERTKIT_WEBHOOK_EVENT]: ConvertkitWebhookEvent
  [EMAIL_WRITING_REQUESTED_EVENT]: EmailWritingRequested
  [EMAIL_WRITING_REQUEST_COMPLETED_EVENT]: EmailWritingRequestCompleted
  [LESSON_COMPLETED_EVENT]: LessonCompleted
  [NEW_PURCHASE_CREATED_EVENT]: NewPurchaseCreated
  [OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT]: OauthProviderAccountLinked
  [PURCHASE_STATUS_UPDATED_EVENT]: PurchaseStatusUpdated
  [PURCHASE_TRANSFERRED_EVENT]: PurchaseTransferred
  [SANITY_WEBHOOK_EVENT]: SanityWebhookEvent
  [STRIPE_CHECKOUT_COMPLETED_EVENT]: StripeCheckoutCompleted
  [STRIPE_WEBHOOK_RECEIVED_EVENT]: StripeWebhookReceived
  [SYNC_CONVERTKIT_PURCHASE_TAGS_EVENT]: SyncConvertkitPurchaseTags
}
export const inngest = new Inngest({
  id: process.env.INNGEST_APP_NAME || process.env.NEXT_PUBLIC_SITE_TITLE,
  schemas: new EventSchemas().fromRecord<IngestEvents>(),
})
