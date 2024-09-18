import {inngest} from '@/inngest/inngest.server'
import {prisma} from '@skillrecordings/database'
import {Redis} from '@upstash/redis'
import {PURCHASE_TRANSFERRED_EVENT} from '@skillrecordings/skill-lesson'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const purchaseTransferComplete = inngest.createFunction(
  {id: `purchase-transfer-complete`, name: 'Purchase Transfer Completed'},
  {event: PURCHASE_TRANSFERRED_EVENT},
  async ({event, step}) => {
    const {sourceUserId, targetUserId, purchaseId} = event.data

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

    const availableBonuses: string | null = (await step.run(
      'get available bonuses',
      async () => {
        return redis.get(`bonus::available::${sourceUserId}::${purchaseId}`)
      },
    )) as string | null

    if (availableBonuses) {
      await step.run('transfer available bonuses', async () => {
        return redis.set(
          `bonus::available::${targetUserId}::${purchaseId}`,
          availableBonuses,
        )
      })

      await step.run('delete available bonuses', async () => {
        return redis.del(`bonus::available::${sourceUserId}::${purchaseId}`)
      })

      return {sourceUserId, targetUserId, purchaseId}
    }

    return 'nothing to do'
  },
)
