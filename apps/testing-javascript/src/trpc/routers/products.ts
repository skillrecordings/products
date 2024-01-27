import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {getAllProducts, getActiveProduct} from '@/server/products.server'

export const productsRouter = router({
  getProducts: publicProcedure.query(async () => {
    const products = await getAllProducts()

    return products
  }),
  getDefaultProduct: publicProcedure.query(async () => {
    const defaultProduct = await getActiveProduct(
      process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID as string,
    )
    return defaultProduct
  }),
})
