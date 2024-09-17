import {LESSON_COMPLETED_EVENT} from '@skillrecordings/skill-lesson/inngest/events'
import {prisma} from '@skillrecordings/database'
import {Redis} from '@upstash/redis'
import {getModuleProgress} from '@skillrecordings/skill-lesson/lib/module-progress'

import {WebClient} from '@slack/web-api'

import {postToSlack} from '@skillrecordings/skill-api'
import {inngest} from '@/inngest/inngest.server'
import {getLessonWithModule} from '@/lib/lessons'
import {
  EMAIL_WRITING_REQUEST_COMPLETED_EVENT,
  EMAIL_WRITING_REQUESTED_EVENT,
} from '@/inngest/events'
import {LessonCompleteEmailProps} from '@/emails/lesson-complete-email'
import {getLessonCompleteEmailOptions} from '@/server/get-email-options'
import {sendTheEmail} from '@/server/send-the-email'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const lessonCompleted = inngest.createFunction(
  {
    id: 'lesson-completed',
    name: 'Lesson Completed',
    debounce: {
      period: '13h',
      key: 'event.user.id',
    },
  },
  {event: LESSON_COMPLETED_EVENT},
  async ({event, step}) => {
    const user = await step.run('get user', async () => {
      return prisma.user.findUnique({
        where: {
          id: event.user.id,
        },
      })
    })

    if (!user) throw new Error('user not found')

    const UNSUBSCRIBED_KEY = `unsubscribed:${user.id}:kody-the-encouragement-bot`

    const isUnsubscribed = await step.run(
      'Check if Learner is Unsubscribed',
      async () => {
        return await redis.get(UNSUBSCRIBED_KEY)
      },
    )

    if (isUnsubscribed) {
      return 'learner has opted out of lesson progress notifications'
    }

    const lessonWithModule = await step.run(
      'Get Lesson With Module',
      async () => {
        return await getLessonWithModule(event.data.lessonSanityId as string)
      },
    )

    if (lessonWithModule.solution) {
      const FIRST_LESSON_KEY = `first-lesson:${user.id}:${lessonWithModule.module.slug.current}`

      const hasReceivedFirstLessonEmail = await step.run(
        'Check if Received First Lesson Email',
        async () => {
          return await redis.get(FIRST_LESSON_KEY)
        },
      )

      const canSendFirstLessonEmail =
        !hasReceivedFirstLessonEmail &&
        lessonWithModule.solution &&
        !lessonWithModule.module.moduleCompleted

      if (canSendFirstLessonEmail) {
        const hasAuthedLocally = await step.run(
          'Check if Locally Authenticated',
          async () => {
            const deviceToken = await prisma.deviceAccessToken.findFirst({
              where: {
                userId: user.id,
              },
            })
            return Boolean(deviceToken)
          },
        )

        await step.run('send first email to ai writer loop', async () => {
          const moduleProgress = await getModuleProgress({
            userId: user.id,
            moduleSlug: lessonWithModule.module.slug.current,
          })

          await inngest.send({
            name: EMAIL_WRITING_REQUESTED_EVENT,
            data: {
              currentLesson: lessonWithModule,
              moduleProgress,
              currentModuleSlug: lessonWithModule.module.current,
              currentLessonSlug: event.data.lessonSlug,
              currentSectionSlug: lessonWithModule.section.slug,
            },
            user: user,
          })
        })

        const aiEmail = await step.waitForEvent('ai writer loop completed', {
          event: EMAIL_WRITING_REQUEST_COMPLETED_EVENT,
          timeout: '15m',
          if: 'event.user.id == async.user.id && async.data.lessonId == event.data.lessonSanityId',
        })

        const defaultSubject = `You finished ${lessonWithModule.title}`
        const defaultBody = `You a lesson in ${lessonWithModule.module.title}! That's awesome.`

        const emailOptions = getLessonCompleteEmailOptions(
          user,
          defaultSubject,
          hasAuthedLocally,
          lessonWithModule,
          defaultBody,
          aiEmail,
        )

        const emailSendResponse = await step.run(
          'send first lesson of module completed email',
          async () => {
            return await sendTheEmail<LessonCompleteEmailProps>(emailOptions)
          },
        )

        if (emailSendResponse.ErrorCode === 0) {
          await step.run('set first lesson email sent', async () => {
            return await redis.set(
              FIRST_LESSON_KEY,
              emailSendResponse.MessageID,
            )
          })

          await step.run('post lesson email to slack', async () => {
            return await postToSlack({
              webClient: new WebClient(process.env.SLACK_TOKEN),
              channel: process.env.SLACK_EMAIL_POST_CHANNEL!,
              username: 'Kody the Encouragement Bot',
              text: `${user.email} was sent:`,
              attachments: [
                {
                  text: emailOptions.componentProps.body,
                  color: '#4893c9',
                  title: emailOptions.Subject,
                },
              ],
            })
          })
        }
      }
    }

    const MODULE_COMPLETE_KEY = `module-complete:${user.id}:${lessonWithModule.module.slug.current}`

    const hasReceivedModuleCompleteEmail = await step.run(
      'Check if Received ModuleComplete Email',
      async () => {
        return await redis.get(MODULE_COMPLETE_KEY)
      },
    )

    const moduleProgress = await step.run('Get Module Progress', async () => {
      return await getModuleProgress({
        userId: user.id,
        moduleSlug: lessonWithModule.module.slug.current,
      })
    })

    if (!hasReceivedModuleCompleteEmail && moduleProgress.moduleCompleted) {
      const hasAuthedLocally = await step.run(
        'Check if Locally Authenticated',
        async () => {
          const deviceToken = await prisma.deviceAccessToken.findFirst({
            where: {
              userId: user.id,
            },
          })

          return Boolean(deviceToken)
        },
      )

      await step.run(
        'send module complete email to ai writer loop',
        async () => {
          await inngest.send({
            name: EMAIL_WRITING_REQUESTED_EVENT,
            data: {
              currentLesson: lessonWithModule,
              moduleProgress,
              currentModuleSlug: lessonWithModule.module.current,
              currentLessonSlug: event.data.lessonSlug,
              currentSectionSlug: lessonWithModule.section.slug,
            },
            user: user,
          })
        },
      )

      const aiEmail = await step.waitForEvent(
        'ai writer loop completed for module',
        {
          event: EMAIL_WRITING_REQUEST_COMPLETED_EVENT,
          timeout: '15m',
          if: 'event.user.id == async.user.id && async.data.lessonId == event.data.lessonSanityId',
        },
      )

      const defaultSubject = `You finished ${lessonWithModule.module.title}`
      const defaultBody = `You completed ${lessonWithModule.module.title}! That's awesome.`

      const emailOptions = getLessonCompleteEmailOptions(
        event,
        defaultSubject,
        hasAuthedLocally,
        lessonWithModule,
        defaultBody,
        aiEmail,
      )

      const emailSendResponse = await step.run(
        'send module completed email',
        async () => {
          return await sendTheEmail<LessonCompleteEmailProps>(emailOptions)
        },
      )

      if (emailSendResponse.ErrorCode === 0) {
        await step.run('set module complete email sent', async () => {
          return await redis.set(
            MODULE_COMPLETE_KEY,
            emailSendResponse.MessageID,
          )
        })

        await step.run('post module email to slack', async () => {
          return await postToSlack({
            webClient: new WebClient(process.env.SLACK_TOKEN),
            channel: process.env.SLACK_EMAIL_POST_CHANNEL!,
            username: 'Kody the Encouragement Bot',
            text: `${user.email} was sent:`,
            attachments: [
              {
                text: emailOptions.componentProps.body,
                color: '#4893c9',
                title: emailOptions.Subject,
              },
            ],
          })
        })
      }
    }

    return 'yup, here we are'
  },
)
