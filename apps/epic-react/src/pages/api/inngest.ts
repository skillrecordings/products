import {serve} from 'inngest/next'
import {inngest} from '@skillrecordings/inngest'

export const config = {
  maxDuration: 300,
}

export default serve({
  client: inngest,
  functions: [],
})
