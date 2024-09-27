import {inngest} from '@/inngest/inngest.server'
import {prisma} from '@skillrecordings/database'
import {convertkitTagPurchase} from '@skillrecordings/skill-api/dist/core/services/convertkit'

export const SYNC_CONVERTKIT_PURCHASE_TAGS_EVENT =
  'purchase/sync-convertkit-purchases'

export type SyncConvertkitPurchaseTags = {
  name: typeof SYNC_CONVERTKIT_PURCHASE_TAGS_EVENT
  data: {
    offset: number
  }
}
const EPIC_REACT_PRO_V2_PRODUCT_ID = 'kcd_product-clzlrf0g5000008jm0czdanmz'

export const syncConvertkitPurchases = inngest.createFunction(
  {id: `sync-convertkit-purchases`, name: `Sync Convertkit Purchases`},
  {
    event: SYNC_CONVERTKIT_PURCHASE_TAGS_EVENT,
  },
  async ({event, step}) => {
    const BATCH_SIZE = 50
    const listOfPurchases = await step.run(
      `get list of purchases`,
      async () => {
        return prisma.purchase.findMany({
          where: {
            productId: {
              in: [EPIC_REACT_PRO_V2_PRODUCT_ID],
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
            productId: true,
            productId: true,
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

    for (const purchase of listOfPurchases) {
      await step.run('tag purchase in convertkit', async () => {
        return convertkitTagPurchase(purchase.user.email, purchase)
      })

      await step.sleep('wait 1 second', '300ms')
    }

    if (listOfPurchases.length === BATCH_SIZE) {
      await inngest.send({
        name: SYNC_CONVERTKIT_PURCHASE_TAGS_EVENT,
        data: {
          offset: (event.data.offset || 0) + BATCH_SIZE,
        },
      })
    }
  },
)
