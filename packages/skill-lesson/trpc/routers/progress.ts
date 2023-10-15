import {z} from 'zod'
import {getSdk} from '@skillrecordings/database'
import {SubscriberSchema} from '../../schemas/subscriber'
import {publicProcedure, router} from '../trpc.server'
import {getToken} from 'next-auth/jwt'
import {getLesson} from '../../lib/lesson-resource'
import {LESSON_COMPLETED_EVENT} from '../../inngest/events'
import {Inngest} from 'inngest'

async function sendInngestProgressEvent({
  user,
  lessonId,
  lessonSlug,
}: {
  user: any
  lessonId: any
  lessonSlug: any
}) {
  if (process.env.INNGEST_EVENT_KEY) {
    const inngest = new Inngest({
      id:
        process.env.INNGEST_APP_NAME ||
        process.env.NEXT_PUBLIC_SITE_TITLE ||
        'User Progress',
      eventKey: process.env.INNGEST_EVENT_KEY,
    })

    await inngest.send({
      name: LESSON_COMPLETED_EVENT,
      data: {
        lessonSanityId: lessonId,
        lessonSlug: lessonSlug,
      },
      user,
    })
  }
}

export const progressRouter = router({
  add: publicProcedure
    .input(
      z.object({
        lessonSlug: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      const {findOrCreateUser, completeLessonProgressForUser} = getSdk()
      try {
        const lesson = await getLesson(input.lessonSlug)
        if (token) {
          completeLessonProgressForUser({
            userId: token.id as string,
            lessonId: lesson._id,
          })
          await sendInngestProgressEvent({
            user: token,
            lessonId: lesson._id,
            lessonSlug: lesson.slug,
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

          completeLessonProgressForUser({
            userId: user.id,
            lessonId: lesson._id,
          })

          await sendInngestProgressEvent({
            user,
            lessonId: lesson._id,
            lessonSlug: lesson.slug,
          })
        }
        return true
      } catch (error) {
        console.error(error)
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        return {error: message}
      }
    }),
  toggle: publicProcedure
    .input(
      z.object({
        lessonSlug: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      const {findOrCreateUser, toggleLessonProgressForUser} = getSdk()
      try {
        const lesson = await getLesson(input.lessonSlug)
        if (token) {
          const progress = await toggleLessonProgressForUser({
            userId: token.id as string,
            lessonId: lesson._id as string,
          })

          if (progress.completedAt) {
            await sendInngestProgressEvent({
              user: token,
              lessonId: lesson._id,
              lessonSlug: lesson.slug,
            })
          }

          return progress
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

          const progress = await toggleLessonProgressForUser({
            userId: user.id,
            lessonId: lesson._id as string,
          })

          if (progress.completedAt) {
            await sendInngestProgressEvent({
              user: token,
              lessonId: lesson._id,
              lessonSlug: lesson.slug,
            })
          }

          return progress
        }
      } catch (error) {
        console.error(error)
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        return {error: message}
      }
    }),
  get: publicProcedure.query(async ({ctx}) => {
    const {findOrCreateUser, getLessonProgressForUser} = getSdk()
    const token = await getToken({req: ctx.req})
    if (token) {
      try {
        const lessonProgress = await getLessonProgressForUser(
          token.id as string,
        )
        return lessonProgress || []
      } catch (error) {
        console.error(error)
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        return []
      }
    } else {
      const subscriberCookie = ctx.req.cookies['ck_subscriber']

      if (!subscriberCookie) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))

      if (!subscriber?.email_address) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const {user} = await findOrCreateUser(subscriber.email_address)

      const lessonProgress = await getLessonProgressForUser(user.id as string)
      return lessonProgress || []
    }
  }),
  clear: publicProcedure
    .input(
      z.object({
        lessons: z.array(
          z.object({
            id: z.string(),
            slug: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      const lessons = input.lessons
      if (token) {
        try {
          const {clearLessonProgressForUser} = getSdk()
          await clearLessonProgressForUser({
            userId: token.id as string,
            lessons: lessons,
          })
        } catch (error) {
          console.error(error)
          let message = 'Unknown Error'
          if (error instanceof Error) message = error.message
          return {error: message}
        }
      }
    }),
})
