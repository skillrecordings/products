import {Redis} from '@upstash/redis'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getToken} from 'next-auth/jwt'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {v4} from 'uuid'

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

      if (bonusSlugs.includes(input.bonusSlug)) {
        let json, sellableId, clientId, productId

        if (input.bonusSlug === 'testing-javascript') {
          // Write purchase to kcd-products
          productId = 'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5'

          const purchaseData = z
            .object({
              id: z.string(),
              userId: z.string(),
              createdAt: z.string(),
              totalAmount: z.number(),
              city: z.string().nullable(),
              state: z.string().nullable(),
              country: z.string().nullable(),
              ip_address: z.string().nullable(),
              status: z.union([
                z.literal('Valid'),
                z.literal('Refunded'),
                z.literal('Banned'),
              ]),
              productId: z.string(),
              couponId: z.string().nullable(),
              merchantChargeId: z.string().nullable(),
              upgradedFromId: z.string().nullable(),
              bulkCouponId: z.string().nullable(),
              redeemedBulkCouponId: z.string().nullable(),
            })
            .parse({
              id: v4(),
              userId: token?.sub,
              createdAt: new Date().toISOString(),
              totalAmount: 0,
              city: null,
              state: null,
              country: null,
              ip_address: null,
              status: 'Valid',
              productId,
              couponId: null,
              merchantChargeId: null,
              upgradedFromId: null,
              bulkCouponId: null,
              redeemedBulkCouponId: null,
            })

          json = await ctx.prisma.purchase.create({data: purchaseData})
        } else if (input.bonusSlug === 'epic-react') {
          // TODO: write to kcd-products database after cutting over ER site.
          sellableId = 385975
          clientId = process.env.EPIC_REACT_CLIENT_ID

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

          json = await response.json()
        } else {
          throw new Error('No sellableId found for bonus slug')
        }

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
