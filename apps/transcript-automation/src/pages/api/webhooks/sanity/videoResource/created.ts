import {withSentry} from '@sentry/nextjs'
import {sanityVideoResourceWebhook} from '@skillrecordings/skill-lesson/lib/sanity'

export default withSentry(sanityVideoResourceWebhook)

export const config = {
  api: {
    externalResolver: true,
  },
}
