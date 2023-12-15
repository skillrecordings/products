import {inngest} from 'inngest/inngest.server'
import {prisma} from '@skillrecordings/database'
import {BULK_PURCHASE_COUPON_REDEEMED} from '@skillrecordings/inngest'
import {applyBonuses} from 'inngest/functions/purchase/apply-bonuses-for-user'

export const bulkPurchasedRedeemed = inngest.createFunction(
  {id: `bulk-purchase-redeemed`, name: 'Bulk Purchase Redeemed'},
  {event: BULK_PURCHASE_COUPON_REDEEMED},
  async ({event, step}) => {
    const {purchaseId, bulkCouponUsedId} = event.data

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

    const bulkCouponUsed = await step.run('load product', async () => {
      return prisma.coupon.findUnique({
        where: {
          id: bulkCouponUsedId,
        },
        include: {
          bulkPurchase: true,
        },
      })
    })

    if (!bulkCouponUsed || !bulkCouponUsed.bulkPurchase) {
      return 'invalid bulk coupon id'
    }

    return await applyBonuses({
      date: new Date(bulkCouponUsed.bulkPurchase.createdAt),
      step,
      user: event.user,
      purchase,
    })
  },
)
