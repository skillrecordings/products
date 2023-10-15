import {Inngest, EventSchemas} from 'inngest'
import {IngestEvents} from '@/pages/api/inngest'

export const inngest = new Inngest({
  id: process.env.NEXT_PUBLIC_SITE_TITLE,
  schemas: new EventSchemas().fromRecord<IngestEvents>(),
})
