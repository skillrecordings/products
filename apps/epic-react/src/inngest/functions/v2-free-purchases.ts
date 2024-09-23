import {inngest} from '@/inngest/inngest.server'
import {prisma} from '@skillrecordings/database'
import {find, isEmpty} from 'lodash'

export const SYNC_FREE_V2_PURCHASE_TAGS_EVENT = 'purchase/sync-free-v2'

export type SyncFreeV2PurchaseTags = {
  name: typeof SYNC_FREE_V2_PURCHASE_TAGS_EVENT
  data: {
    offset: number
  }
}
const EPIC_REACT_PRO_V2_PRODUCT_ID = 'kcd_product-clzlrf0g5000008jm0czdanmz'

const ER_v1_PRODUCT_IDS = ['cbffba30-0d05-4376-9d95-3f906ae272b9']

import {v4} from 'uuid'

export const v2FreePurchases = inngest.createFunction(
  {id: `sync-free-v2-purchase-tags`, name: `Sync Free V2 Purchase`},
  {
    event: SYNC_FREE_V2_PURCHASE_TAGS_EVENT,
  },
  async ({event, step}) => {
    const BATCH_SIZE = 50
    const listOfPurchases = await step.run(
      `get list of purchases`,
      async () => {
        return prisma.purchase.findMany({
          where: {
            productId: {
              in: ER_v1_PRODUCT_IDS,
            },
            status: {
              in: ['Valid', 'Restricted'],
            },
          },
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
            createdAt: true,
            status: true,
            country: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            redeemedBulkCoupon: {
              select: {
                bulkPurchase: {
                  select: {
                    createdAt: true,
                  },
                },
              },
            },
          },
          take: BATCH_SIZE,
          skip: event.data.offset || 0,
        })
      },
    )

    for (const previousPurchase of listOfPurchases) {
      const erV2Purchase = await step.run(
        `get er v2 purchase for ${previousPurchase.user.email}`,
        async () => {
          try {
            const existingPurchase = await prisma.purchase.findFirst({
              where: {
                userId: previousPurchase.userId,
                productId: EPIC_REACT_PRO_V2_PRODUCT_ID,
              },
            })

            if (!existingPurchase) {
              return null
            }

            return existingPurchase
          } catch (e) {
            console.log(e)
            return null
          }
        },
      )

      if (!erV2Purchase) {
        await step.run(
          `creating er v2 purchase for ${previousPurchase.user.email}`,
          async () => {
            console.log({previousPurchase})
            console.log(
              `creating er v2 purchase for ${previousPurchase.user.email}`,
            )
            return prisma.purchase.create({
              data: {
                id: `free-er-v2-${v4()}`,
                status: previousPurchase.status,
                country: previousPurchase.country,
                createdAt: new Date(),
                totalAmount: 0,
                productId: EPIC_REACT_PRO_V2_PRODUCT_ID,
                userId: previousPurchase.userId,
              },
            })
          },
        )
      }
    }

    if (listOfPurchases.length === BATCH_SIZE) {
      await inngest.send({
        name: SYNC_FREE_V2_PURCHASE_TAGS_EVENT,
        data: {
          offset: (event.data.offset || 0) + BATCH_SIZE,
        },
      })
    }
  },
)

const convertkitBaseUrl = 'https://api.convertkit.com/v3/'

async function fetchSubscriber({
  convertkitId,
  convertkitApiSecret,
  convertkitApiKey,
  subscriberEmail,
}: {
  convertkitId?: string | number
  subscriberEmail?: string
  convertkitApiSecret: string
  convertkitApiKey: string
}) {
  let subscriber

  if (convertkitId) {
    const subscriberUrl = `${convertkitBaseUrl}/subscribers/${convertkitId}?api_secret=${convertkitApiSecret}`
    subscriber = await fetch(subscriberUrl)
      .then((res) => res.json())
      .then(({subscriber}: any) => {
        return subscriber
      })
  }

  if (!subscriber && subscriberEmail) {
    const tagsApiUrl = `${convertkitBaseUrl}subscribers?api_secret=${convertkitApiSecret}&email_address=${subscriberEmail
      .trim()
      .toLowerCase()}`
    subscriber = await fetch(tagsApiUrl)
      .then((res) => res.json())
      .then((res: any) => {
        const subscribers = res.subscribers
        return subscribers[0]
      })
  }

  if (isEmpty(subscriber)) return

  const tagsApiUrl = `${convertkitBaseUrl}/subscribers/${subscriber.id}/tags?api_key=${convertkitApiKey}`
  const tags = await fetch(tagsApiUrl).then((res) => res.json())

  return {...subscriber, tags}
}

export async function setConvertkitSubscriberFields({
  fields,
  subscriber,
  convertkitApiSecret,
  convertkitApiKey,
}: {
  subscriber: {id: string | number; fields: Record<string, string | null>}
  fields: Record<string, string>
  convertkitApiSecret: string
  convertkitApiKey: string
}) {
  for (const field in fields) {
    await createConvertkitCustomField({
      customField: field,
      subscriberId: subscriber.id.toString(),
      convertkitApiSecret,
      convertkitApiKey,
    })
  }
  return await fetch(`${convertkitBaseUrl}/subscribers/${subscriber.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      api_secret: process.env.CONVERTKIT_API_SECRET,
      fields,
    }),
  }).then((res) => res.json())
}

export async function createConvertkitCustomField({
  customField,
  subscriberId,
  convertkitApiSecret,
  convertkitApiKey,
}: {
  convertkitApiSecret: string
  convertkitApiKey: string
  customField: string
  subscriberId: string
}) {
  try {
    const subscriber = await fetchSubscriber({
      convertkitId: subscriberId,
      convertkitApiSecret,
      convertkitApiKey,
    })

    const fieldExists =
      subscriber?.fields &&
      !isEmpty(
        find(Object.keys(subscriber.fields), (field) => field === customField),
      )

    if (!fieldExists) {
      await fetch(`${convertkitBaseUrl}/custom_fields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          api_secret: convertkitApiSecret,
          label: customField,
        }),
      })
    }
  } catch (e) {
    console.log({e})
    console.debug(`convertkit field not created: ${customField}`)
  }
}
