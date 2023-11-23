import {serve} from 'inngest/next'
import {inngest, syncSanityProductsWithDb} from '@skillrecordings/inngest'

export const config = {
  maxDuration: 300,
}

export default serve({
  client: inngest,
  functions: [syncSanityProductsWithDb],
})
