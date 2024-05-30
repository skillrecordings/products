import {inngest} from 'inngest/inngest.server'
import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import * as yaml from 'js-yaml'
import {prisma} from '@skillrecordings/database'
import {z} from 'zod'
import {Redis} from '@upstash/redis'
import groq from 'groq'
import {WebClient} from '@slack/web-api'
import pluralize from 'pluralize'
import {isEmpty} from 'lodash'
import {postToSlack} from '@skillrecordings/skill-api'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const filterSchema = z.object({
  ppp: z.boolean().optional(),
  quantity: z.number().optional(),
})

function epochToISOString(epoch: number): string {
  const date = new Date(epoch)
  return date.toISOString()
}

export const stripeCheckoutCompleted = inngest.createFunction(
  {id: `stripe-checkout-completed`, name: 'Stripe Checkout Completed'},
  {event: STRIPE_CHECKOUT_COMPLETED_EVENT},
  async ({event, step}) => {
    const {quantity, created, purchaseId, productId} = event.data

    const teamPurchase = quantity > 1

    const purchase = await step.run('load purchase', async () => {
      return prisma.purchase.findUnique({
        where: {
          id: purchaseId,
        },
        include: {
          user: true,
        },
      })
    })

    if (!purchase) {
      return 'invalid purchase id'
    }

    const product = await step.run('load product', async () => {
      const productToAnnounce = await sanityClient.fetch(
        groq`*[_type == "product" && productId == $productId][0] {
        title,
        productId,
        "slug": slug.current,
        modules[]->{
          "slug": slug.current,
          "instructors": contributors[@.role == 'instructor'].contributor->{
              saleAnnounceChannel,
              "slug": slug.current,
          }
        }
      }`,
        {productId},
      )

      return z
        .object({
          title: z.string(),
          productId: z.string(),
          slug: z.string(),
          modules: z.array(
            z.object({
              slug: z.string(),
              instructors: z.array(
                z.object({
                  saleAnnounceChannel: z.string(),
                  slug: z.string(),
                }),
              ),
            }),
          ),
        })
        .parse(productToAnnounce)
    })

    for (const module of product.modules) {
      for (const instructor of module.instructors) {
        if (
          instructor.saleAnnounceChannel &&
          instructor.slug !== `kent-c-dodds`
        ) {
          await step.run('send slack message', async () => {
            try {
              if (process.env.SLACK_TOKEN) {
                return await postToSlack({
                  webClient: new WebClient(process.env.SLACK_TOKEN),
                  channel: instructor.saleAnnounceChannel,
                  text:
                    process.env.NODE_ENV === 'production'
                      ? `Someone purchased ${product.title}`
                      : `Someone purchased ${product.title} in ${process.env.NODE_ENV}`,
                  attachments: [
                    {
                      fallback: `Sold (${quantity}) ${product.title}`,
                      text: `Somebody (${
                        purchase.user?.email || 'unknown'
                      }) bought ${quantity} ${pluralize('copy', quantity)} of ${
                        product.title
                      } for ${`$${purchase.totalAmount}`}${
                        isEmpty(purchase.upgradedFromId) ? '' : ' as an upgrade'
                      }`,
                      color:
                        process.env.NODE_ENV === 'production'
                          ? '#eba234'
                          : '#5ceb34',
                      title: `Sold (${quantity}) ${product.title}`,
                    },
                  ],
                })
              }
            } catch (e) {
              return `error sending slack message: ${(e as Error).message}`
            }
          })
        }
      }
    }

    if (teamPurchase) {
    } else {
      const date = epochToISOString(created)
      const availableBonuses = await step.run('get bonuses', async () => {
        const query = `*[_type == "bonus" && expiresAt > $date && validFrom < $validFrom]{
              title,
              "slug": slug.current,
              filter,
              description,
              expiresAt
            }`
        return sanityClient.fetch(query, {
          date,
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
