import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {getSdk} from '@skillrecordings/database'
import {SubscriberSchema} from 'lib/convertkit'

export const progressRouter = createRouter().mutation('add', {
  input: z.object({
    lessonSlug: z.string(),
  }),
  async resolve({ctx, input}) {
    const {findOrCreateUser, completeLessonProgressForUser} = getSdk()
    try {
      const subscriberCookie = ctx.req.cookies['ck_subscriber']

      if (!subscriberCookie) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))

      if (!subscriber) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const {user} = await findOrCreateUser(subscriber.email_address)

      return await completeLessonProgressForUser({
        userId: user.id,
        lessonSlug: input.lessonSlug,
      })
    } catch (error) {
      console.error(error)
      let message = 'Unknown Error'
      if (error instanceof Error) message = error.message
      return {error: message}
    }
  },
})
