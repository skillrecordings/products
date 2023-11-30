import {inngest} from '@/inngest/inngest.server'
import {USER_CREATED_EVENT} from '@skillrecordings/skill-lesson'
import {
  getSubscriberByEmail,
  subscribeToForm,
} from '@skillrecordings/convertkit-sdk'

export const userCreated = inngest.createFunction(
  {
    id: 'user-created',
    name: 'User Created',
    idempotency: `event.user.email`,
  },
  {event: USER_CREATED_EVENT},
  async ({event, step}) => {
    let convertKitSubscriber = await step.run(
      'check if ConvertKit subscriber exists',
      async () => {
        return getSubscriberByEmail(event.user.email)
      },
    )

    if (!convertKitSubscriber) {
      await step.sleep('sleep for 5 minutes', 300000)
      convertKitSubscriber = await step.run(
        'subscribe user to ConvertKit form',
        async () => {
          return await subscribeToForm({
            email: event.user.email,
            formId: process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM,
          })
        },
      )
    }

    return convertKitSubscriber
  },
)
