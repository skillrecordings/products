type SanityEventData = {
  _type: string
  _id: string
  event: string
}

export const SANITY_WEBHOOK_EVENT = 'sanity/webhook'

export type SanityWebhookEvent = {
  name: typeof SANITY_WEBHOOK_EVENT
  data: SanityEventData
}
