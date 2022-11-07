import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {getWorkshop} from '../../lib/workshops'
import {getToken} from 'next-auth/jwt'
import {defineRulesForPurchases, UserSchema} from '../../ability/ability'
import {SubscriberSchema} from '../../schemas/subscriber'
import {getTutorial} from '../../lib/tutorials'
import {getExercise} from '../../lib/exercises'
import {getSection} from '../../lib/sections'

export const workshop = createRouter()
  .query('bySlug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ctx, input}) {
      return await getWorkshop(input.slug)
    },
  })
  .query('verifyAccess', {
    input: z.object({
      moduleSlug: z.string(),
      moduleType: z.string(),
      lessonSlug: z.string().optional(),
      sectionSlug: z.string().optional(),
      isSolution: z.boolean().optional(),
    }),
    async resolve({ctx, input}) {
      const token = await getToken({req: ctx.req})
      const subscriberCookie = ctx.req.cookies['ck_subscriber']
      const {
        moduleSlug,
        moduleType,
        lessonSlug,
        sectionSlug,
        isSolution = false,
      } = input

      const module =
        moduleType === 'workshop'
          ? await getWorkshop(moduleSlug)
          : await getTutorial(moduleSlug)
      const lesson = lessonSlug ? await getExercise(lessonSlug) : undefined
      const section = sectionSlug ? await getSection(sectionSlug) : undefined

      const rules = defineRulesForPurchases({
        ...(token && {user: UserSchema.parse(token)}),
        ...(subscriberCookie && {
          subscriber: SubscriberSchema.parse(JSON.parse(subscriberCookie)),
        }),
        module,
        lesson,
        section,
        isSolution,
      })

      return rules
    },
  })
