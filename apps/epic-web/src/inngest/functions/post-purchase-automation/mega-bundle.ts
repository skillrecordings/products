import {inngest} from 'inngest/inngest.server'
import {NEW_PURCHASE_CREATED_EVENT} from '@skillrecordings/inngest'
import {prisma} from '@skillrecordings/database'
import {v4} from 'uuid'
import {
  PIXEL_PERFECT_TAILWIND_PRODUCT_ID,
  FULL_STACK_VOL_ONE_PRODUCT_ID,
  TESTING_JAVASCRIPT_PRODUCT_ID,
  EPIC_REACT_PRO_V1_PRODUCT_ID,
  EPIC_REACT_PRO_PRODUCT_ID,
  MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID,
  TESTING_FUNDAMENTALS_PRODUCT_ID,
  REACT_COMPONENT_TESTING_WITH_VITEST_PRODUCT_ID,
  ADVANCED_VITEST_PATTERNS_PRODUCT_ID,
} from 'utils/mega-bundle-discount-calculator'

export const megaBundleProductId = '4a3706d4-7154-45ad-b9c6-05f25fae51df'

export const megaBundle = inngest.createFunction(
  {id: 'megabundle-2024-11-27', name: 'Post-Purchase - Mega Bundle 2024'},
  {
    event: NEW_PURCHASE_CREATED_EVENT,
    if: `event.data.productId == "${megaBundleProductId}"`,
  },
  async ({event, step}) => {
    const {purchaseId} = event.data
    const purchase = await step.run('load purchase', async () => {
      const purchase = await prisma.purchase.findUnique({
        where: {
          id: purchaseId,
        },
        include: {
          user: true,
        },
      })

      if (!purchase) throw new Error('Purchase not found')

      return purchase
    })

    const isNotTeamPurchase = purchase.bulkCouponId === null

    if (isNotTeamPurchase) {
      const MEGABUNDLE_PRODUCT_IDS = [
        PIXEL_PERFECT_TAILWIND_PRODUCT_ID,
        FULL_STACK_VOL_ONE_PRODUCT_ID,
        TESTING_JAVASCRIPT_PRODUCT_ID,
        EPIC_REACT_PRO_V1_PRODUCT_ID,
        EPIC_REACT_PRO_PRODUCT_ID,
        MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID,
        TESTING_FUNDAMENTALS_PRODUCT_ID,
        REACT_COMPONENT_TESTING_WITH_VITEST_PRODUCT_ID,
        ADVANCED_VITEST_PATTERNS_PRODUCT_ID,
      ]

      for (const productId of MEGABUNDLE_PRODUCT_IDS) {
        await step.run(`create purchase for ${productId}`, async () => {
          const newPurchaseId = `${purchaseId}~${productId}`

          await prisma.purchase.create({
            data: {
              id: newPurchaseId,
              userId: purchase.userId,
              redeemedBulkCouponId: purchase.redeemedBulkCouponId,
              productId,
              totalAmount: 0,
              status: purchase.status,
              country: purchase.country,
              state: purchase.state,
              city: purchase.city,
            },
          })
        })
      }
    }
  },
)
