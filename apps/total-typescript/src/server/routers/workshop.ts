import {publicProcedure, router} from '../trpc'
import {z} from 'zod'
import {getWorkshop} from '../../lib/workshops'
import {getToken} from 'next-auth/jwt'
import {
  defineRulesForPurchases,
  UserSchema,
} from '@skillrecordings/skill-lesson/utils/ability'
import {SubscriberSchema} from '@skillrecordings/skill-lesson/schemas/subscriber'
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
})
