import {inngest} from 'inngest/inngest.server'
import {LESSON_COMPLETED_EVENT} from '@skillrecordings/skill-lesson'
import {Redis} from '@upstash/redis'
import {ServerClient} from 'postmark'
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const client = new ServerClient(process.env.POSTMARK_KEY)
export const resumeProgressAfterInactivity = inngest.createFunction(
  {
    id: 'resume-progress-after-inactivity',
    name: 'Encourage Activity',
    cancelOn: [{event: LESSON_COMPLETED_EVENT, match: 'user.id'}],
    idempotency: `event.data.lessonId`,
  },
  {event: LESSON_COMPLETED_EVENT},
  async ({event, step}) => {
    await step.sleep('wait for 18 hours', '18h')

    await step.sleep('wait for 3 days', '3d')

    await step.sleep('wait for 7 days', '7d')

    await step.sleep('wait for 30 days', '30d')

    await step.sleep('wait for 30 days', '90d')

    return 'yup, here we are'
  },
)
