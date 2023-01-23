import {serve} from 'inngest/next'
import {convertkitSurveyAnswered} from '@skillrecordings/inngest'

export default serve(process.env.NEXT_PUBLIC_SITE_TITLE, [
  convertkitSurveyAnswered,
])
