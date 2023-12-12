import {serve} from 'inngest/next'
import {inngestConfig} from '../../inngest/inngest.config'

export const config = {
  maxDuration: 300,
}

export default serve(inngestConfig)
