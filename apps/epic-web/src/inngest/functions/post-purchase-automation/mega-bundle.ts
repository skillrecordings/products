import {inngest} from 'inngest/inngest.server'
import {NEW_PURCHASE_CREATED_EVENT} from '@skillrecordings/inngest'
import {prisma} from '@skillrecordings/database'
import {v4} from 'uuid'

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
      const FULL_STACK_VOL_ONE_PRODUCT_ID =
        'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002'
      const TESTING_JAVASCRIPT_PRODUCT_ID =
        'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5'
      const EPIC_REACT_PRO_V1_PRODUCT_ID =
        'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38'
      const EPIC_REACT_PRO_PRODUCT_ID = 'kcd_product-clzlrf0g5000008jm0czdanmz'
      const PIXEL_PERFECT_TAILWIND_PRODUCT_ID =
        '1b6e7ed6-8a15-48f1-8dd7-e76612581ee8'
      const MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID =
        'f3f85931-e67e-456f-85c4-eec95a0e4ddd'
      const TESTING_FUNDAMENTALS_PRODUCT_ID =
        '7872d512-ba34-4108-b510-7db9cbcee98c'

      const MEGABUNDLE_PRODUCT_IDS = [
        PIXEL_PERFECT_TAILWIND_PRODUCT_ID,
        FULL_STACK_VOL_ONE_PRODUCT_ID,
        TESTING_JAVASCRIPT_PRODUCT_ID,
        EPIC_REACT_PRO_V1_PRODUCT_ID,
        EPIC_REACT_PRO_PRODUCT_ID,
        MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID,
        TESTING_FUNDAMENTALS_PRODUCT_ID,
      ]

      for (const productId of MEGABUNDLE_PRODUCT_IDS) {
        await step.run(`create purchase for ${productId}`, async () => {
          const newPurchaseId = v4()

          await prisma.purchase.create({
            data: {
              id: newPurchaseId,
              userId: purchase.userId,
              redeemedBulkCouponId: purchase.redeemedBulkCouponId,
              productId,
              totalAmount: 0,
            },
          })
        })
      }
    }
  },
)
