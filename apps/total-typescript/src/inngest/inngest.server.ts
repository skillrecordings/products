import {Inngest, EventSchemas} from 'inngest'

import {
  USER_CREATED_EVENT,
  UserCreated,
} from '@skillrecordings/skill-lesson/inngest/events'

export type IngestEvents = {
  [USER_CREATED_EVENT]: UserCreated
}

export const inngest = new Inngest({
  id: process.env.INNGEST_APP_NAME || process.env.NEXT_PUBLIC_SITE_TITLE,
  schemas: new EventSchemas().fromRecord<IngestEvents>(),
})
