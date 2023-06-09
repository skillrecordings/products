import {withSentry} from '@sentry/nextjs'
import {castingwordsWebhookReceiver} from '@skillrecordings/skill-lesson/lib/castingwords'

export default withSentry(castingwordsWebhookReceiver)

export const config = {
  api: {
    externalResolver: true,
  },
}
