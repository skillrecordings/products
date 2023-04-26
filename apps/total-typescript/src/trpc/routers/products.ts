import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {getActiveProducts} from '@skillrecordings/skill-lesson/path-to-purchase/products.server'

export const productsRouter = router({
  getProducts: publicProcedure.query(async () => {
    const products = await getActiveProducts()

    return products
  }),
})
