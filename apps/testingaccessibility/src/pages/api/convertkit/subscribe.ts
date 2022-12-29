import convertkitSubscribeHandler from '@skillrecordings/convertkit-react-ui/dist/api/subscribe'
import {withSentry} from '@sentry/nextjs'

export default withSentry(convertkitSubscribeHandler)

export const config = {
  api: {
    externalResolver: true,
  },
}
