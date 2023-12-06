import {inngest} from '@/inngest/inngest.server'
import {userCreated} from '@/inngest/functions/user/user-created'

export const inngestConfig = {
  client: inngest,
  functions: [userCreated],
}
