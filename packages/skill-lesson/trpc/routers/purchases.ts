import {getSdk, Purchase} from '@skillrecordings/database'
import {publicProcedure, router} from '../trpc.server'
import {get, isEmpty, last} from 'lodash'
import {getToken} from 'next-auth/jwt'
import {z} from 'zod'

export const purchasesRouter = router({
  getPurchaseById: publicProcedure
    .input(
      z.object({
        purchaseId: z.string().nullish(),
      }),
    )
    .query(async ({input: {purchaseId}}) => {
      const {getPurchase} = getSdk()

      return purchaseId
        ? await getPurchase({
            where: {id: purchaseId},
          })
        : null
    }),
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
  getPurchasesByProductIds: publicProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      const {getPurchasesForUser} = getSdk()

      if (token && token.sub) {
        const purchases = (await getPurchasesForUser(token.id as string)) || []
        const currentPurchases = purchases.filter((purchase) => {
          return input.productIds.includes(purchase.productId)
        })

        return currentPurchases
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
          return purchase.productId === input.productId
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
