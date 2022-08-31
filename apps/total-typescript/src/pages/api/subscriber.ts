import convertkitSubscriberHandler from '@skillrecordings/convertkit/dist/api/subscriber'
import {withSentry} from '@sentry/nextjs'

export default withSentry(convertkitSubscriberHandler)
export const config = {
  api: {
    externalResolver: true,
  },
}
