import {prisma} from '@skillrecordings/database'

import * as Amplitude from '@amplitude/node'
import {Identify} from '@amplitude/identify'
import {inngest} from 'inngest/inngest.server'

export const syncConversions = inngest.createFunction(
  {
    id: 'sync-conversions',
    name: 'Sync Conversions',
  },
  {
    event: 'analytics/conversion',
  },
  async ({event, step}) => {
    const BATCH_SIZE = 100
    const amplitude = Amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!)
    const listOfPurchases = await step.run(
      `get list of purchases`,
      async () => {
        return prisma.purchase.findMany({
          where: {
            status: {
              in: ['Valid', 'Restricted'],
            },
            productId: {
              in: [
                '0143b3f6-d5dd-4f20-9898-38da609799ca',
                '1b6e7ed6-8a15-48f1-8dd7-e76612581ee8',
                '2267e543-51fa-4d71-a02f-ad9ba71a1f8e',
                '2e5b2993-d069-4e43-a7f1-24cffa83f7ac',
                '5809fd2e-8072-42eb-afa2-aff7c9999d0c',
                '5ffdd0ef-a7a3-431e-b36b-f4232da7e454',
                '7872d512-ba34-4108-b510-7db9cbcee98c',
                'dc9b750c-e3bc-4b0a-b7d2-d04a481afa0d',
                'f3f85931-e67e-456f-85c4-eec95a0e4ddd',
                'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002',
              ],
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
      if (!purchase.user) continue

      await step.run('send to amplitude', async () => {
        if (!purchase.user) return
        const identify = new Identify()
        await amplitude.identify(purchase.user.email, null, identify)
        await amplitude.logEvent({
          event_type: 'purchase',
          user_id: purchase.user.email,
          time: new Date(purchase.createdAt).getTime(),
          ...(purchase.country && {country: purchase.country}),
          event_properties: {
            product: purchase.productId,
            total: purchase.totalAmount,
            status: purchase.status,
          },
        })
      })
    }

    if (listOfPurchases.length === BATCH_SIZE) {
      await step.sendEvent('send next batch', {
        name: 'analytics/conversion',
        data: {
          offset: (event.data.offset || 0) + BATCH_SIZE,
        },
      })
    }
    return event.data.offset || 0
  },
)
