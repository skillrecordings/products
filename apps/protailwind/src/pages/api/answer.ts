import quizAnswerApiHandler from '@skillrecordings/quiz/dist/pages/api/answer'
import {withSentry} from '@sentry/nextjs'

export default withSentry(quizAnswerApiHandler)

export const config = {
  api: {
    externalResolver: true,
  },
}
