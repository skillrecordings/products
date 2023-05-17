import {inngest} from './inngest.server'
import EmailProvider from 'next-auth/providers/email'

export const convertkitSurveyAnswered = inngest.createFunction(
  {name: 'ConvertKit Survey Answered'},
  {event: 'convertkit/survey.answered'},
  async ({event, step}) => {
    step.sleep('1 second')

    return {event, body: 'now you can do stuff!'}
  },
)
