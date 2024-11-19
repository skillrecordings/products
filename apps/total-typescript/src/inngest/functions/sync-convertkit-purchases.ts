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
              in: [
                'tt_00c02ac7-6f95-4ad4-8aac-999b243df6c1',
                'tt_81cfce3a-369c-4214-bc4e-204d577b3c8b',
                'tt_product_79434686-6437-48ac-956e-1357aba87672',
                'tt_product_clxjgl7fg000108l8eifn69dt',
              ],
            },
            status: {
              in: ['Valid', 'Restricted'],
            },
          },
          include: {
            user: true,
          },
          take: BATCH_SIZE,
          skip: event.data.offset || 0,
        })
      },
    )

    for (const purchase of listOfPurchases) {
      await step.run('tag purchase in convertkit', async () => {
        return purchase?.user?.email
          ? await convertkitTagPurchase(purchase.user.email, purchase as any)
          : null
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
