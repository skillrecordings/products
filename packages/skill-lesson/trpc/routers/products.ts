import {publicProcedure, router} from '../trpc.server'
import {getActiveProducts} from '../../path-to-purchase/products.server'
import {getSdk} from '@skillrecordings/database'

export const productsRouter = router({
  getProducts: publicProcedure.query(async () => {
    const products = await getActiveProducts()

    return products
  }),
  getDefaultProduct: publicProcedure.query(async () => {
    const {getProduct} = getSdk()
    const products = await getProduct({
      where: {
        id: process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID
      }
    })

    return products
  }),
})
