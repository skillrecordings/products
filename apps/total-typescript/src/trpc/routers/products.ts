import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {
  getActiveProducts,
  getProduct,
} from '@skillrecordings/skill-lesson/path-to-purchase/products.server'
import {z} from 'zod'

export const productsRouter = router({
  getProductById: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {productId} = input
      const product = await getProduct(productId)

      return product
    }),
})
