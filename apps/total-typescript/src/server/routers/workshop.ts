import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {getWorkshop} from '../../lib/workshops'
import {getToken} from 'next-auth/jwt'
import {defineRulesForPurchases, UserSchema} from '../../ability/ability'
import {SubscriberSchema} from '../../schemas/subscriber'
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
      moduleSlug: z.string().optional(),
      moduleType: z.string().optional(),
      lessonSlug: z.string().optional(),
      sectionSlug: z.string().optional(),
      isSolution: z.boolean().optional(),
    }),
    async resolve({ctx, input}) {
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
    },
  })
