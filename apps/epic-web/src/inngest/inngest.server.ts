import {Inngest, EventSchemas} from 'inngest'

import {
  LLMSuggestionsCreated,
  NewTipVideo,
  SRTReadyEvent,
  TranscriptCreatedEvent,
  TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT,
  TIP_VIDEO_SRT_READY_EVENT,
  TIP_VIDEO_TRANSCRIPT_CREATED_EVENT,
  TIP_VIDEO_UPLOADED_EVENT,
} from 'inngest/events'
import {
  STRIPE_CHECKOUT_COMPLETED_EVENT,
  StripeCheckoutCompleted,
} from '@skillrecordings/inngest'

export type IngestEvents = {
  [TIP_VIDEO_UPLOADED_EVENT]: NewTipVideo
  [TIP_VIDEO_TRANSCRIPT_CREATED_EVENT]: TranscriptCreatedEvent
  [TIP_VIDEO_SRT_READY_EVENT]: SRTReadyEvent
  [TIP_VIDEO_LLM_SUGGESTIONS_CREATED_EVENT]: LLMSuggestionsCreated
  [STRIPE_CHECKOUT_COMPLETED_EVENT]: StripeCheckoutCompleted
}
export const inngest = new Inngest({
  name: process.env.INNGEST_APP_NAME || process.env.NEXT_PUBLIC_SITE_TITLE,
  schemas: new EventSchemas().fromRecord<IngestEvents>(),
})
