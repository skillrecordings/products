import {inngest} from '@/inngest/inngest.server'
import {userCreated} from '@/inngest/functions/user/user-created'
import {sanityProductFunctions} from '@/inngest/functions/sanity/product'
import {syncConvertkitPurchases} from '@/inngest/functions/sync-convertkit-purchases'
export const inngestConfig = {
  client: inngest,
  functions: [userCreated, ...sanityProductFunctions, syncConvertkitPurchases],
}
