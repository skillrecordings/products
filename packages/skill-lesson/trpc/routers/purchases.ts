import {getSdk, Purchase} from '@skillrecordings/database'
import {publicProcedure, router} from '../trpc.server'
import {get, isEmpty, last} from 'lodash'
import {getToken} from 'next-auth/jwt'
import {z} from 'zod'
import {getProduct} from '../../lib/products'

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
  getPurchaseDetailsById: publicProcedure
    .input(
      z.object({
        purchaseId: z.string().nullish(),
      }),
    )
    .query(async ({input: {purchaseId}, ctx}) => {
      const token = await getToken({req: ctx.req})
      const {getPurchaseDetails} = getSdk()

      return purchaseId && token && token.sub
        ? await getPurchaseDetails(purchaseId as string, token.sub)
        : null
    }),
  getLastPurchase: publicProcedure.query(async ({ctx}) => {
    const token = await getToken({req: ctx.req})
    const {getPurchaseDetails, getPurchasesForUser} = getSdk()

    if (token && token.sub) {
      const purchases = (await getPurchasesForUser(token.id as string)) || []

      if (!isEmpty(purchases)) {
        const purchaseId = get(
          last(
            purchases.sort(
              (a: any, b: any) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            ),
          ),
          'id',
        )

        const purchaseDetails = await getPurchaseDetails(
          purchaseId as string,
          token.sub,
        )
        const product = await getProduct(
          purchaseDetails.purchase?.product.id as string,
        )

        return {...purchaseDetails, slug: product?.slug?.current || 'unknown'}
      }
    }
    return false
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
  getAllPurchasesForUser: publicProcedure.query(async ({ctx}) => {
    const token = await getToken({req: ctx.req})
    const {getPurchasesForUser} = getSdk()

    if (token && token.sub) {
      return await getPurchasesForUser(token.id as string)
    }

    return []
  }),
})
