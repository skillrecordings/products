import {inngest} from 'inngest/inngest.server'
import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import * as yaml from 'js-yaml'
import {prisma} from '@skillrecordings/database'
import {z} from 'zod'
import {Redis} from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const filterSchema = z.object({
  ppp: z.boolean().optional(),
  quantity: z.number().optional(),
})

function epochToISOString(epoch: number): string {
  const date = new Date(epoch * 1000) // Convert to milliseconds
  return date.toISOString()
}

export const stripeCheckoutCompleted = inngest.createFunction(
  {id: `stripe-checkout-completed`, name: 'Stripe Checkout Completed'},
  {event: STRIPE_CHECKOUT_COMPLETED_EVENT},
  async ({event, step}) => {
    const {quantity, created, purchaseId} = event.data

    const teamPurchase = quantity > 1

    const purchase = await step.run('load purchase', async () => {
      return prisma.purchase.findUnique({
        where: {
          id: purchaseId,
        },
      })
    })

    if (!purchase) {
      return 'invalid purchase id'
    }

    if (teamPurchase) {
    } else {
      const date = epochToISOString(created)
      const availableBonuses = await step.run('get bonuses', async () => {
        const query = `*[_type == "bonus" && expiresAt > $date]{
              title,
              "slug": slug.current,
              filter,
              description,
              expiresAt
            }`
        return sanityClient.fetch(query, {
          date,
        })
      })

      if (availableBonuses.length > 0) {
        const applicableBonuses: string[] = []
        for (const availableBonus of availableBonuses) {
          try {
            const filters = availableBonus.filter
              ? filterSchema.parse(yaml.load(availableBonus.filter))
              : {}
            if (filters.quantity === 1 && purchase.bulkCouponId) {
              break
            }
            if (filters.ppp === false && purchase.status !== 'Valid') {
              break
            }
            applicableBonuses.push(availableBonus.slug)
          } catch (e) {
            console.error('invalid bonus', e)
          }
        }

        await step.run('apply bonus for user', async () => {
          const key = `bonus::available::${event.user.id}::${purchaseId}`
          const value = applicableBonuses.join(',')
          return {
            response: await redis.set(key, value),
            key,
            value,
          }
        })

        return {applicableBonuses}
      }
    }

    return 'yup, here we are'
  },
)
