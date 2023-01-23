import {inngest} from './inngest.server'

export const convertkitSurveyAnswered = inngest.createStepFunction(
  'ConvertKit Survey Answered',
  'convertkit/survey-answered',
  ({event, tools}) => {
    tools.sleep('1 second')
    return {event, body: 'now you can do stuff!'}
  },
)
