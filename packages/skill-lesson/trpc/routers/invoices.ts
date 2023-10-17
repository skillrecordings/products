import {z} from 'zod'
import {publicProcedure, router} from '../trpc.server'
import {getSdk} from '@skillrecordings/database'
import {stripe} from '@skillrecordings/commerce-server'

export const invoicesRouter = router({
  getChargeDetails: publicProcedure
    .input(
      z.object({
        merchantChargeId: z.string(),
      }),
    )
    .query(async ({input: {merchantChargeId}}) => {
      const {getProduct, getPurchaseForStripeCharge, getMerchantCharge} =
        getSdk()

      const merchantCharge = await getMerchantCharge(merchantChargeId)

      if (merchantCharge && merchantCharge.identifier) {
        const charge = await stripe.charges.retrieve(
          merchantCharge.identifier,
          {
            expand: ['customer'],
          },
        )

        const purchase = await getPurchaseForStripeCharge(
          merchantCharge.identifier,
        )
        const bulkCoupon = purchase && purchase.bulkCoupon

        let quantity = 1
        if (purchase?.merchantSession?.identifier) {
          const checkoutSession = await stripe.checkout.sessions.retrieve(
            purchase?.merchantSession?.identifier,
            {expand: ['line_items']},
          )

          quantity = checkoutSession.line_items?.data[0].quantity || 1
        } else if (bulkCoupon) {
          quantity = bulkCoupon.maxUses
        }

        const product = await getProduct({
          where: {id: purchase?.productId},
        })

        if (product && charge && purchase) {
          return {
            state: 'SUCCESS' as const,
            result: {
              product,
              charge,
              quantity,
              bulkCoupon,
              purchaseId: purchase?.id,
            },
          }
        }
      }

      return {
        state: 'FAILED' as const,
        error: 'Unable to lookup the charge and related entities',
      }
    }),
})
