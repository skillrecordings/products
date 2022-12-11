import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {getSdk} from '@skillrecordings/database'
import {SubscriberSchema} from 'schemas/subscriber'
import {getToken} from 'next-auth/jwt'

export const progressRouter = createRouter()
  .mutation('add', {
    input: z.object({
      lessonSlug: z.string(),
    }),
    async resolve({ctx, input}) {
      const token = await getToken({req: ctx.req})
      const {findOrCreateUser, completeLessonProgressForUser} = getSdk()
      try {
        if (token) {
          return await completeLessonProgressForUser({
            userId: token.id as string,
            lessonSlug: input.lessonSlug,
          })
        } else {
          const subscriberCookie = ctx.req.cookies['ck_subscriber']

          if (!subscriberCookie) {
            console.debug('no subscriber cookie')
            return {error: 'no subscriber found'}
          }

          const subscriber = SubscriberSchema.parse(
            JSON.parse(subscriberCookie),
          )

          if (!subscriber?.email_address) {
            console.debug('no subscriber cookie')
            return {error: 'no subscriber found'}
          }

          const {user} = await findOrCreateUser(subscriber.email_address)

          return await completeLessonProgressForUser({
            userId: user.id,
            lessonSlug: input.lessonSlug,
          })
        }
      } catch (error) {
        console.error(error)
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        return {error: message}
      }
    },
  })
  .query('get', {
    async resolve({ctx}) {
      const {getLessonProgressForUser} = getSdk()
      const token = await getToken({req: ctx.req})
      if (token) {
        try {
          const lessonProgress = await getLessonProgressForUser(
            token.id as string,
          )
          return lessonProgress
        } catch (error) {
          console.error(error)
          let message = 'Unknown Error'
          if (error instanceof Error) message = error.message
          return {error: message}
        }
      }
    },
  })
