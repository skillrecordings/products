import {inngest} from './inngest.server'

export const convertkitSurveyAnswered = inngest.createFunction(
  {
    id: 'convertkit-survey-answered',
    name: 'ConvertKit Survey Answered',
  },
  {event: 'convertkit/survey.answered'},
  ({event, step}) => {
    step.sleep('wait 1 second', '1s')
    return {event, body: 'now you can do stuff!'}
  },
)
