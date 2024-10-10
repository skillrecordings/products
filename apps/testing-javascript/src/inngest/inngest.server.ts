import {Inngest, EventSchemas} from 'inngest'
import {
  NEW_PURCHASE_CREATED_EVENT,
  NewPurchaseCreated,
  PURCHASE_STATUS_UPDATED_EVENT,
  PurchaseStatusUpdated,
} from '@skillrecordings/inngest'
import {
  OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT,
  OauthProviderAccountLinked,
} from '@/inngest/events'

export type IngestEvents = {
  [NEW_PURCHASE_CREATED_EVENT]: NewPurchaseCreated
  [PURCHASE_STATUS_UPDATED_EVENT]: PurchaseStatusUpdated
  [OAUTH_PROVIDER_ACCOUNT_LINKED_EVENT]: OauthProviderAccountLinked
  'user/login': {}
  'user/created': {}
}
export const inngest = new Inngest({
  id: process.env.INNGEST_APP_NAME || process.env.NEXT_PUBLIC_SITE_TITLE,
  schemas: new EventSchemas().fromRecord<IngestEvents>(),
})
