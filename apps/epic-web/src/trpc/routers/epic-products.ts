import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getProduct} from 'lib/products'

export const epicProductsRouter = router({
  getProduct: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const product = await getProduct(input.productId)
      if (!product) {
        return null
      }
      return product
    }),
})
