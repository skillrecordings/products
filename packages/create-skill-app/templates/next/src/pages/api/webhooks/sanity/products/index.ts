import {withSentry} from '@sentry/nextjs'
import {sanityProductsSyncWebhook} from '@skillrecordings/skill-lesson/lib/sanity'

export default withSentry(sanityProductsSyncWebhook)

export const config = {
  api: {
    externalResolver: true,
  },
}
