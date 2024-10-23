import {z} from 'zod'
import {answerSurvey, markLessonComplete} from '../../lib/convertkit'
import {
  fetchSubscriber,
  formatDate,
  setConvertkitSubscriberFields,
  subscribeToEndpoint,
  updateSubscriber,
} from '@skillrecordings/convertkit-sdk'
import {serialize} from 'cookie'
import {SubscriberSchema} from '../../schemas/subscriber'
import {publicProcedure, router} from '../trpc.server'
import {isArray, snakeCase} from 'lodash'

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
  answerSurveyMultiple: publicProcedure
    .input(
      z.object({
        answers: z.record(z.string(), z.any()),
        email: z.string().optional(),
        surveyId: z.string().optional(),
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

      let fields: Record<string, string> = {
        last_surveyed_on: formatDate(new Date()),
        ...(input.surveyId && {
          [`completed_${input.surveyId}_survey_on`]: formatDate(new Date()),
        }),
      }

      for (const answer in input.answers) {
        fields[answer] = isArray(input.answers[answer])
          ? input.answers[answer].join(', ')
          : input.answers[answer]
      }

      console.log('answerSurveyMultiple fields', fields)

      if (convertkitId) {
        subscriber = SubscriberSchema.parse(await fetchSubscriber(convertkitId))
      } else if (subscriberCookie) {
        subscriber = SubscriberSchema.parse(JSON.parse(subscriberCookie))
      }

      if (!subscriber && input.email) {
        //subscribe user
        subscriber = await subscribeToEndpoint(
          `/forms/${process.env.NEXT_PUBLIC_CONVERTKIT_SIGNUP_FORM}/subscribe`,
          {
            email: input.email,
            fields,
          },
        )
      }

      if (!subscriber) {
        return {error: 'no subscriber found'}
      }

      let updatedSubscriber = await fetchSubscriber(subscriber.id.toString())

      if (fields) {
        updatedSubscriber = await setConvertkitSubscriberFields(
          updatedSubscriber,
          fields,
        )
      }

      console.log(JSON.stringify(updatedSubscriber.subscriber))

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
      const convertkitCookieId = serialize(
        `ck_subscriber_id`,
        JSON.stringify(updatedSubscriber.subscriber.id),
        {
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 31556952,
        },
      )

      ctx.res.setHeader('Set-Cookie', [convertkitCookie, convertkitCookieId])

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
  addFields: publicProcedure
    .input(
      z.object({
        subscriber: SubscriberSchema,
        fields: z.record(z.string()),
      }),
    )
    .mutation(async ({ctx, input}) => {
      try {
        const {subscriber, fields} = input
        await setConvertkitSubscriberFields(
          {id: subscriber.id, fields: subscriber.fields},
          fields,
        )
        return {
          success: true,
        }
      } catch (error) {
        console.log(`Couldn't set convertkit fields`, error)
        return {
          success: false,
        }
      }
    }),
})
