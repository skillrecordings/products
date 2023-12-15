import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import yaml from 'js-yaml'
import {Redis} from '@upstash/redis'
import {z} from 'zod'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const filterSchema = z.object({
  ppp: z.boolean().optional(),
  quantity: z.number().optional(),
  productId: z.string().optional(),
})

export const applyBonuses = async ({
  date,
  step,
  user,
  purchase,
}: {
  date: Date
  step: any
  user: {id: string}
  purchase: any
}) => {
  const availableBonuses = await step.run('get bonuses', async () => {
    const query = `*[_type == "bonus" && (expiresAt > $date || expiresAt == null) && validFrom < $validFrom]{
              title,
              "slug": slug.current,
              filter,
              description,
              expiresAt
            }`
    return sanityClient.fetch(query, {
      date: date.toISOString(),
      validFrom: new Date().toISOString(),
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
        if (
          filters.productId &&
          filters.productId !== process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID
        ) {
          break
        }
        applicableBonuses.push(availableBonus.slug)
      } catch (e) {
        console.error('invalid bonus', e)
      }
    }

    await step.run('apply bonus for user', async () => {
      const key = `bonus::available::${user.id}::${purchase.id}`
      const value = applicableBonuses.join(',')
      return {
        response: await redis.set(key, value),
        key,
        value,
      }
    })

    return {applicableBonuses}
  }

  return 'nothing here'
}
