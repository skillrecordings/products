import {z} from 'zod'
import {answerSurvey, markLessonComplete} from '../../lib/convertkit'
import {
  fetchSubscriber,
  setConvertkitSubscriberFields,
  updateSubscriber,
} from '@skillrecordings/convertkit-sdk'
import {serialize} from 'cookie'
import {SubscriberSchema} from '../../schemas/subscriber'
import {publicProcedure, router} from '../trpc.server'
import {snakeCase} from 'lodash'

export const convertkitRouter = router({
  updateName: publicProcedure
    .input(
      z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const subscriberCookie = ctx.req.cookies['ck_subscriber']
      const {first_name, last_name} = input

      if (!subscriberCookie) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))

      if (!subscriber) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const updatedSubscriber = await updateSubscriber({
        id: subscriber.id,
        first_name,
        fields: {...(last_name && {last_name})},
      })

      const convertkitCookie = serialize(
        `ck_subscriber`,
        JSON.stringify(updatedSubscriber.subscriber),
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 31556952,
        },
      )

      ctx.res.setHeader('Set-Cookie', convertkitCookie)

      return updatedSubscriber
    }),
  completeLesson: publicProcedure
    .input(
      z.object({
        moduleSlug: z.string(),
        lessonSlug: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const subscriberCookie = ctx.req.cookies['ck_subscriber']

      if (!subscriberCookie) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))

      if (!subscriber) {
        return {error: 'no subscriber found'}
      }

      const updatedSubscriber = await markLessonComplete({
        subscriber,
        ...input,
      })

      const convertkitCookie = serialize(
        `ck_subscriber`,
        JSON.stringify(updatedSubscriber.subscriber),
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 31556952,
        },
      )

      ctx.res.setHeader('Set-Cookie', convertkitCookie)

      return updatedSubscriber
    }),
  answerSurvey: publicProcedure
    .input(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      let subscriber
      const convertkitId =
        ctx.req.cookies?.[
          process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBER_KEY ||
            'ck_subscriber_id'
        ]

      const subscriberCookie = ctx.req.cookies['ck_subscriber']

      if (convertkitId) {
        subscriber = SubscriberSchema.parse(await fetchSubscriber(convertkitId))
      } else if (subscriberCookie) {
        subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))
      }

      if (!subscriber) {
        return {error: 'no subscriber found'}
      }

      const updatedSubscriber = await answerSurvey({
        subscriber,
        ...input,
      })

      const convertkitCookie = serialize(
        `ck_subscriber`,
        JSON.stringify(updatedSubscriber.subscriber),
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 31556952,
        },
      )

      ctx.res.setHeader('Set-Cookie', convertkitCookie)

      return updatedSubscriber
    }),
  completeModule: publicProcedure
    .input(
      z.object({
        module: z.object({
          slug: z.string(),
          moduleType: z.string(),
        }),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {module} = input
      const completedModuleField = {
        // ex: completed_zod_tutorial: 2022-09-02
        [`completed_${snakeCase(module.slug)}_${
          module.moduleType
        }`.toLowerCase()]: new Date().toISOString().slice(0, 10),
      }
      const subscriberCookie = ctx.req.cookies['ck_subscriber']

      if (!subscriberCookie) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))

      await setConvertkitSubscriberFields(subscriber, completedModuleField)
    }),
  startModule: publicProcedure
    .input(
      z.object({
        module: z.object({
          slug: z.string(),
          moduleType: z.string(),
        }),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const {module} = input
      const startedModuleField = {
        // ex: started_zod_tutorial: 2022-09-02
        [`started_${snakeCase(module.slug)}_${
          module.moduleType
        }`.toLowerCase()]: new Date().toISOString().slice(0, 10),
      }
      const subscriberCookie = ctx.req.cookies['ck_subscriber']

      if (!subscriberCookie) {
        console.debug('no subscriber cookie')
        return {error: 'no subscriber found'}
      }

      const subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))

      await setConvertkitSubscriberFields(subscriber, startedModuleField)
    }),
})
