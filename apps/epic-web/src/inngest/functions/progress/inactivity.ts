import {inngest} from 'inngest/inngest.server'
import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'
import {LESSON_COMPLETED_EVENT} from '@skillrecordings/skill-lesson'
export const lessonCompleted = inngest.createFunction(
  {
    name: 'Encourage Activity',
    cancelOn: [{event: LESSON_COMPLETED_EVENT, match: 'user.id'}],
  },
  {event: STRIPE_CHECKOUT_COMPLETED_EVENT},
  async ({event, step}) => {
    await step.sleep('3d')

    return 'yup, here we are'
  },
)
