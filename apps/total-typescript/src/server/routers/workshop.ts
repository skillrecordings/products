import {publicProcedure, router} from '../trpc'
import {z} from 'zod'
import {getWorkshop} from '../../lib/workshops'
import {getToken} from 'next-auth/jwt'
import {defineRulesForPurchases, UserSchema} from '../../video/ability'
import {SubscriberSchema} from '../../video/subscriber'
import {getTutorial} from '../../lib/tutorials'
import {getExercise} from '../../lib/exercises'
import {getSection} from '../../lib/sections'
import {NextApiRequest} from 'next'

function getSubscriberFromCookie(req: NextApiRequest) {
  const cookies = req.cookies
  if (!cookies) return null
  const cookie = cookies['ck_subscriber']
  if (!cookie || cookie === 'undefined') return null
  try {
    return SubscriberSchema.parse(JSON.parse(cookie))
  } catch (e) {
    console.error(e)
    return null
  }
}

export const workshop = router({
  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      return await getWorkshop(input.slug)
    }),
  verifyAccess: publicProcedure
    .input(
      z.object({
        moduleSlug: z.string().optional(),
        moduleType: z.string().optional(),
        lessonSlug: z.string().optional(),
        sectionSlug: z.string().optional(),
        isSolution: z.boolean().optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      const convertkitSubscriber = getSubscriberFromCookie(ctx.req)
      const {
        moduleSlug,
        moduleType,
        lessonSlug,
        sectionSlug,
        isSolution = false,
      } = input

      const module = moduleSlug
        ? moduleType === 'workshop'
          ? await getWorkshop(moduleSlug)
          : await getTutorial(moduleSlug)
        : undefined
      const lesson = lessonSlug ? await getExercise(lessonSlug) : undefined
      const section = sectionSlug ? await getSection(sectionSlug) : undefined

      const rules = defineRulesForPurchases({
        ...(token && {user: UserSchema.parse(token)}),
        ...(convertkitSubscriber && {
          subscriber: convertkitSubscriber,
        }),
        module,
        lesson,
        section,
        isSolution,
      })

      return rules
    }),
})
