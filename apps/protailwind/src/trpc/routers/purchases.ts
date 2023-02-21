import {getSdk, Purchase} from '@skillrecordings/database'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {get, isEmpty, last} from 'lodash'
import {getToken} from 'next-auth/jwt'
import {z} from 'zod'

export const purchasesRouter = router({
  getLastPurchase: publicProcedure.query(async ({ctx}) => {
    const token = await getToken({req: ctx.req})
    const {getPurchaseDetails, getPurchasesForUser} = getSdk()

    if (token && token.sub) {
      const purchases = (await getPurchasesForUser(token.id as string)) || []

      if (!isEmpty(purchases)) {
        const purchaseId = get(last(purchases), 'id')
        const purchaseDetails = await getPurchaseDetails(
          purchaseId as string,
          token.sub,
        )

        return purchaseDetails
      }
    }
  }),
  getPurchaseByProductId: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      const {getPurchaseDetails, getPurchasesForUser} = getSdk()

      if (token && token.sub) {
        const purchases = (await getPurchasesForUser(token.id as string)) || []
        const currentPurchase = purchases.find((purchase) => {
          return (
            purchase.productId === input.productId &&
            purchase.status === 'Valid'
          )
        })

        if (currentPurchase) {
          const purchaseId = currentPurchase.id
          const purchaseDetails = await getPurchaseDetails(
            purchaseId as string,
            token.sub,
          )

          return purchaseDetails
        }
      }
    }),
})
