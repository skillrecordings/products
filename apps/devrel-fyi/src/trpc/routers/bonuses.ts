import {Redis} from '@upstash/redis'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getToken} from 'next-auth/jwt'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const bonusesRouter = router({
  availableBonusesForPurchase: publicProcedure
    .input(
      z.object({
        purchaseId: z.string().optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token || !input.purchaseId) return []

      const availableBonuses: string | null = await redis.get(
        `bonus::available::${token.id}::${input.purchaseId}`,
      )

      const bonusSlugs = availableBonuses?.split(',') || []

      const query = `*[_type == "bonus" && slug.current in ${JSON.stringify(
        bonusSlugs,
      )}]{
              title,
              "slug": slug.current,
              description,
              "image": image.asset->url,
            }`

      return await sanityClient.fetch(query)
    }),
  redeemBonus: publicProcedure
    .input(
      z.object({
        purchaseId: z.string().optional(),
        bonusSlug: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token || !input.purchaseId) return false

      const availableBonuses: string | null = await redis.get(
        `bonus::available::${token.id}::${input.purchaseId}`,
      )

      const bonusSlugs = availableBonuses?.split(',') || []

      // TODO: claim bonus

      return true
    }),
})
