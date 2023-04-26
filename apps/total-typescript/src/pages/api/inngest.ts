import {serve} from 'inngest/next'
import {convertkitSurveyAnswered, inngest} from '@skillrecordings/inngest'

type HelloWorld = {
  name: 'test/hello.world'
  data: {
    name: string
    email: string
  }
}
type Events = {
  'test/hello.world': HelloWorld
}

const helloWorld = inngest.createFunction(
  {name: 'Hello Worldzzzz'},
  {event: 'test/hello.world'},
  async ({event, step}) => {
    await step.sleep('1s')
    return {event, body: 'Hello, World!'}
  },
)

export default serve(inngest, [convertkitSurveyAnswered, helloWorld])
