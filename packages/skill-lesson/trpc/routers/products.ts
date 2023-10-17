import {publicProcedure, router} from '../trpc.server'
import {getProduct} from '../../path-to-purchase/products.server'
import {getAllProducts} from '../../lib/products'
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
  getAllProducts: publicProcedure.query(async () => {
    const products = await getAllProducts()

    return products
  }),
})
