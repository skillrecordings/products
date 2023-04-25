import {publicProcedure, router} from '../trpc.server'
import {getActiveProducts} from '../../path-to-purchase/products.server'

export const productsRouter = router({
  getProducts: publicProcedure.query(async () => {
    const products = await getActiveProducts()

    return products
  }),
})
