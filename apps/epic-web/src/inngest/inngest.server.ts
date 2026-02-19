import {Inngest, EventSchemas} from 'inngest'

import {
  type LLMSuggestionsCreated,
  type NewTipVideo,
  type SRTReadyEvent,
  type TranscriptCreatedEvent,
  type EmailWritingRequested,
  EMAIL_WRITING_REQUESTED_EVENT,
  EMAIL_WRITING_REQUEST_COMPLETED_EVENT,
  TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT,
  TIP_VIDEO_SRT_READY_EVENT,
  TIP_VIDEO_TRANSCRIPT_CREATED_EVENT,
  TIP_VIDEO_UPLOADED_EVENT,
  EmailWritingRequestCompleted,
  OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT,
  OauthProviderAccountLinked,
  // New video processing events
  VIDEO_RESOURCE_CREATED_EVENT,
  VIDEO_TRANSCRIPT_READY_EVENT,
  VIDEO_SRT_READY_EVENT,
  SEO_DESCRIPTION_GENERATION_REQUESTED,
  SEO_DESCRIPTION_GENERATED,
  type VideoResourceCreated,
  type VideoTranscriptReady,
  type VideoSrtReady,
  type SeoDescriptionGenerationRequested,
  type SeoDescriptionGenerated,
} from 'inngest/events'
import {
  CHARGE_REFUNDED_EVENT,
  ChargeRefunded,
  NEW_PURCHASE_CREATED_EVENT,
  NewPurchaseCreated,
  PURCHASE_STATUS_UPDATED_EVENT,
  PurchaseStatusUpdated,
  STRIPE_CHECKOUT_COMPLETED_EVENT,
  STRIPE_WEBHOOK_RECEIVED_EVENT,
  type StripeCheckoutCompleted,
  type StripeWebhookReceived,
} from '@skillrecordings/inngest'
import {
  LESSON_COMPLETED_EVENT,
  type LessonCompleted,
  PURCHASE_TRANSFERRED_EVENT,
  PurchaseTransferred,
} from '@skillrecordings/skill-lesson/inngest/events'
import {
  SANITY_WEBHOOK_EVENT,
  SanityWebhookEvent,
} from './functions/sanity/sanity-inngest-events'
import {
  WORKSHOP_MIGRATION_EVENT,
  type WorkshopMigrationEvent,
  WORKSHOP_AWS_MIGRATION_EVENT,
  type WorkshopAwsMigrationEvent,
  WORKSHOP_AWS_SECTION_EVENT,
  type WorkshopAwsSectionEvent,
} from './functions/sanity/workshop-migration'

export type IngestEvents = {
  // Tip video events
  [TIP_VIDEO_UPLOADED_EVENT]: NewTipVideo
  [TIP_VIDEO_TRANSCRIPT_CREATED_EVENT]: TranscriptCreatedEvent
  [TIP_VIDEO_SRT_READY_EVENT]: SRTReadyEvent
  [TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT]: LLMSuggestionsCreated
  // Generic video processing events
  [VIDEO_RESOURCE_CREATED_EVENT]: VideoResourceCreated
  [VIDEO_TRANSCRIPT_READY_EVENT]: VideoTranscriptReady
  [VIDEO_SRT_READY_EVENT]: VideoSrtReady
  // SEO description events
  [SEO_DESCRIPTION_GENERATION_REQUESTED]: SeoDescriptionGenerationRequested
  [SEO_DESCRIPTION_GENERATED]: SeoDescriptionGenerated
  // Stripe events
  [STRIPE_CHECKOUT_COMPLETED_EVENT]: StripeCheckoutCompleted
  [STRIPE_WEBHOOK_RECEIVED_EVENT]: StripeWebhookReceived
  // Progress events
  [LESSON_COMPLETED_EVENT]: LessonCompleted
  // Email events
  [EMAIL_WRITING_REQUESTED_EVENT]: EmailWritingRequested
  [EMAIL_WRITING_REQUEST_COMPLETED_EVENT]: EmailWritingRequestCompleted
  // Purchase events
  [PURCHASE_TRANSFERRED_EVENT]: PurchaseTransferred
  [NEW_PURCHASE_CREATED_EVENT]: NewPurchaseCreated
  [PURCHASE_STATUS_UPDATED_EVENT]: PurchaseStatusUpdated
  [CHARGE_REFUNDED_EVENT]: ChargeRefunded
  // Sanity events
  [SANITY_WEBHOOK_EVENT]: SanityWebhookEvent
  [WORKSHOP_MIGRATION_EVENT]: WorkshopMigrationEvent
  [WORKSHOP_AWS_MIGRATION_EVENT]: WorkshopAwsMigrationEvent
  [WORKSHOP_AWS_SECTION_EVENT]: WorkshopAwsSectionEvent
  // Auth events
  [OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT]: OauthProviderAccountLinked
  'user/login': {}
  'user/created': {}
  'analytics/conversion': {}
}
export const inngest = new Inngest({
  id: process.env.INNGEST_APP_NAME || process.env.NEXT_PUBLIC_SITE_TITLE,
  schemas: new EventSchemas().fromRecord<IngestEvents>(),
})
