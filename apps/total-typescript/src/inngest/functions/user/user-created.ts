import {inngest} from '@/inngest/inngest.server'
import {USER_CREATED_EVENT} from '@skillrecordings/skill-lesson'
import {
  getSubscriberByEmail,
  subscribeToForm,
} from '@skillrecordings/convertkit-sdk'
import {init, track, identify, Identify} from '@amplitude/analytics-node'

init(process.env.AMPLITUDE_API_KEY)

export const userCreated = inngest.createFunction(
  {
    id: 'user-created',
    name: 'User Created',
    idempotency: `event.user.email`,
  },
  {event: USER_CREATED_EVENT},
  async ({event, step}) => {
    await step.run('track user created', async () => {
      const identifyObj = new Identify()
      identify(identifyObj, {
        user_id: event.user.email,
      })

      track('created user account', undefined, {
        user_id: event.user.email,
      })
    })

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
          track('subscribed to convertkit', undefined, {
            user_id: event.user.email,
          })
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
