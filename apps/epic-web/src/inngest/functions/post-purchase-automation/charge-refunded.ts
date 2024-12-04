import {inngest} from 'inngest/inngest.server'
import {CHARGE_REFUNDED_EVENT} from '@skillrecordings/inngest'
import {prisma} from '@skillrecordings/database'
import {megaBundleProductId} from './mega-bundle'

export const chargeRefunded = inngest.createFunction(
  {id: 'charge-refunded', name: 'Post-Purchase - Charge Refunded'},
  {
    event: CHARGE_REFUNDED_EVENT,
  },
  async ({event, step}) => {
    const {chargeId} = event.data

    const merchantCharge = await step.run('load merchant charge', async () => {
      const merchantCharge = await prisma.merchantCharge.findUnique({
        where: {
          identifier: chargeId,
        },
        select: {
          id: true,
        },
      })

      return merchantCharge
    })

    if (!merchantCharge) {
      throw new Error('Merchant charge not found')
    }

    const purchase = await step.run('load purchase', async () => {
      return await prisma.purchase.findFirst({
        where: {
          merchantChargeId: merchantCharge.id,
        },
        select: {
          id: true,
          productId: true,
        },
      })
    })

    if (!purchase) {
      throw new Error('Purchase not found')
    }

    const product = await step.run('load product', async () => {
      return await prisma.product.findUnique({
        where: {
          id: purchase.productId,
        },
        select: {
          id: true,
        },
      })
    })

    if (product?.id === megaBundleProductId) {
      const productPurchases = await prisma.purchase.findMany({
        where: {
          id: {
            contains: purchase.id,
          },
        },
      })

      for (const productPurchase of productPurchases) {
        await step.run(
          `update purchase ${productPurchase.id} status to Refunded`,
          async () => {
            await prisma.purchase.update({
              where: {id: productPurchase.id},
              data: {status: 'Refunded'},
            })
          },
        )
      }
    }
  },
)
