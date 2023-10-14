import {inngest} from 'inngest/inngest.server'
import {LESSON_COMPLETED_EVENT} from '@skillrecordings/skill-lesson/inngest/events'
import {prisma} from '@skillrecordings/database'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {Redis} from '@upstash/redis'
import postmark from 'postmark'
import FirstLessonCompleteForModule from 'emails/first-lesson-complete-for-module'
import {getModuleProgress} from '@skillrecordings/skill-lesson/lib/module-progress'
import ModuleCompleted from 'emails/module-completed'
import {sendTheEmail} from 'server/send-the-email'
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const getLessonWithModule = async (id: string): Promise<any> => {
  return await sanityClient.fetch(
    `*[_id == $id][0]{
      _id,
      title,
      description,
      workshopApp,
      "solution": resources[@._type == 'solution'][0]{
        _key,
      }
      "section": *[_type in ['section'] && references(^._id)][0]{
        _id,
        "slug": slug.current,
      },
    } | {
      ...,
      "module": *[_type in ['module'] && references(^.section._id)][0] {
        _type,
        title,
        slug,
        body,
        moduleType,
        _id,
        github,
        description,
        github,
        workshopApp,
        "sections": resources[@->._type == 'section']->{
          _id,
          title,
          description,
          "slug": slug.current,
          "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
            _id,
            _type,
            title,
            description,
            "slug": slug.current
          },
          "resources": resources[@->._type in ['linkResource']]->
        },
        "image": image.asset->url, 
      }
    }`,
    {id},
  )
}

export const lessonCompleted = inngest.createFunction(
  {
    id: 'lesson-completed',
    name: 'Lesson Completed',
  },
  {event: LESSON_COMPLETED_EVENT},
  async ({event, step}) => {
    await step.sleep('wait for a few minutes', '7m')

    const lessonWithModule = await step.run(
      'Get Lesson With Module',
      async () => {
        return await getLessonWithModule(event.data.lessonSanityId as string)
      },
    )

    const FIRST_LESSON_KEY = `first-lesson:${event.user.id}:${lessonWithModule.module.slug.current}`

    const hasReceivedFirstLessonEmail = await step.run(
      'Check if Received First Lesson Email',
      async () => {
        return await redis.get(FIRST_LESSON_KEY)
      },
    )

    if (!hasReceivedFirstLessonEmail && lessonWithModule.solution) {
      const hasAuthedLocally = await step.run(
        'Check if Locally Authenticated',
        async () => {
          const deviceToken = await prisma.deviceAccessToken.findFirst({
            where: {
              userId: event.user.id,
            },
          })

          return Boolean(deviceToken)
        },
      )

      const emailSendResponse = await step.run(
        'send first lesson of module completed email',
        async () => {
          return await sendTheEmail<{
            user: {name: string; email: string}
            hasAuthedLocally: boolean
            lesson: any
          }>({
            To: event.user.email,
            Subject: 'You made some progress!',
            Component: FirstLessonCompleteForModule,
            componentProps: {
              user: event.user,
              hasAuthedLocally: hasAuthedLocally,
              lesson: lessonWithModule,
            },
          })
        },
      )

      if (emailSendResponse.ErrorCode === 0) {
        await step.run('set first lesson email sent', async () => {
          return await redis.set(FIRST_LESSON_KEY, emailSendResponse.MessageID)
        })
      }
    }

    const MODULE_COMPLETE_KEY = `module-complete:${event.user.id}:${lessonWithModule.module.slug.current}`

    const hasReceivedModuleCompleteEmail = await step.run(
      'Check if Received ModuleComplete Email',
      async () => {
        return await redis.get(MODULE_COMPLETE_KEY)
      },
    )

    const moduleProgress = await step.run('Get Module Progress', async () => {
      return await getModuleProgress({
        userId: event.user.id,
        moduleSlug: lessonWithModule.module.current,
      })
    })

    if (!hasReceivedModuleCompleteEmail && moduleProgress.moduleCompleted) {
      const emailSendResponse = await step.run(
        'send module completed email',
        async () => {
          return await sendTheEmail<{
            user: {name: string; email: string}
            module: any
          }>({
            To: event.user.email,
            Subject: `You completed ${lessonWithModule.module.title}!`,
            Component: ModuleCompleted,
            componentProps: {
              user: event.user,
              module: lessonWithModule.module,
            },
          })
        },
      )

      if (emailSendResponse.ErrorCode === 0) {
        await step.run('set module complete email sent', async () => {
          return await redis.set(
            MODULE_COMPLETE_KEY,
            emailSendResponse.MessageID,
          )
        })
      }
    }

    return 'yup, here we are'
  },
)
