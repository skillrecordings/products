import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getWorkshop} from '../../lib/workshops'
import {SubscriberSchema} from '@skillrecordings/skill-lesson/schemas/subscriber'
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
