import {inngest} from './inngest.server'

export const convertkitSurveyAnswered = inngest.createFunction(
  {name: 'ConvertKit Survey Answered'},
  {event: 'convertkit/survey.answered'},
  ({event, step}) => {
    step.sleep('1 second')
    return {event, body: 'now you can do stuff!'}
  },
)
