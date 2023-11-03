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
        purchaseId: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token || !input.purchaseId) return []
      const bonusSlugs = await getBonuses(input.purchaseId, token)
      return bonusSlugs
    }),
  redeemBonus: publicProcedure
    .input(
      z.object({
        purchaseId: z.array(z.string()).optional(),
        bonusSlug: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token || !input.purchaseId) return false

      const bonusSlugs = await getBonuses(input.purchaseId, token)

      if (bonusSlugs.includes(input.bonusSlug)) {
        let sellableId, clientId

        if (input.bonusSlug === 'testing-javascript') {
          sellableId = 273899
          clientId = process.env.TESTING_JAVASCRIPT_CLIENT_ID
        } else if (input.bonusSlug === 'epic-react') {
          sellableId = 385975
          clientId = process.env.EPIC_REACT_CLIENT_ID
        }

        if (!sellableId) throw new Error('No sellableId found for bonus slug')

        const response = await fetch(
          `${process.env.EGGHEAD_API_URL}/api/v1/sellable_purchases/redeem_partner_coupon`,
          {
            method: 'POST',
            body: JSON.stringify({
              sellable: 'playlist',
              sellable_id: sellableId,
              email: token.email,
              client_id: clientId,
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.EGGHEAD_EPIC_WEB_BOT_TOKEN}`,
            },
          },
        )

        const json = await response.json()

        const newBonuses = bonusSlugs.filter((slug) => slug !== input.bonusSlug)

        console.log(json)

        if (newBonuses.length === 0) {
          await redis.del(`bonus::available::${token.id}::${input.purchaseId}`)
        } else {
          await redis.set(
            `bonus::available::${token.id}::${input.purchaseId}`,
            newBonuses.join(','),
          )
        }

        return json
      }
      return true
    }),
})

const getBonuses = async (purchaseId: string[], token: any) => {
  const availableBonuses = await Promise.all(
    purchaseId.map(async (purchaseId) => {
      const bonuses: string | null = await redis.get(
        `bonus::available::${token.id}::${purchaseId}`,
      )
      const bonusSlugs = bonuses?.split(',') || []

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
  )
  const bonusSlugs = availableBonuses.filter((bonus) => bonus.length > 0).flat()

  return bonusSlugs
}
