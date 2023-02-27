import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {getActiveProducts} from 'path-to-purchase-react/products.server'

export const productsRouter = router({
  getProducts: publicProcedure.query(async () => {
    const products = await getActiveProducts()

    return products
  }),
})
