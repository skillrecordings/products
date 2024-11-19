import {Inngest, EventSchemas} from 'inngest'

import {
  USER_CREATED_EVENT,
  UserCreated,
} from '@skillrecordings/skill-lesson/inngest/events'

import {
  SANITY_WEBHOOK_EVENT,
  SanityWebhookEvent,
} from './functions/sanity/sanity-inngest-events'
import {
  SYNC_CONVERTKIT_PURCHASE_TAGS_EVENT,
  SyncConvertkitPurchaseTags,
} from './functions/sync-convertkit-purchases'

export type IngestEvents = {
  [USER_CREATED_EVENT]: UserCreated
  [SANITY_WEBHOOK_EVENT]: SanityWebhookEvent
  [SYNC_CONVERTKIT_PURCHASE_TAGS_EVENT]: SyncConvertkitPurchaseTags
}

export const inngest = new Inngest({
  id: process.env.INNGEST_APP_NAME || process.env.NEXT_PUBLIC_SITE_TITLE,
  schemas: new EventSchemas().fromRecord<IngestEvents>(),
})
