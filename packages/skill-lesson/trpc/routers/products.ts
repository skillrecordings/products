import {publicProcedure, router} from '../trpc.server'
import {getActiveProducts} from '../../path-to-purchase/products.server'
import {getAllProducts} from '../../lib/products'

export const productsRouter = router({
  getAllProducts: publicProcedure.query(async () => {
    const products = await getAllProducts()

    return products
  }),
})
