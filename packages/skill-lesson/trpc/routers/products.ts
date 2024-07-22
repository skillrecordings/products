import {publicProcedure, router} from '../trpc.server'
import {getProduct} from '../../path-to-purchase/products.server'
import {getAllProducts} from '../../lib/products'
import {z} from 'zod'
import {prisma} from '@skillrecordings/database'

export const productsRouter = router({
  getProductById: publicProcedure
    .input(
      z.object({
        productId: z.string().optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {productId} = input
      if (!productId) return null
      const product = await getProduct(productId)

      return product
    }),
  getAllProducts: publicProcedure.query(async () => {
    const products = await getAllProducts()

    return products
  }),
  getQuantityAvailableById: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {productId} = input
      const purchaseCount = await prisma.purchase.count({
        where: {
          productId: productId,
          status: {
            in: ['VALID', 'RESTRICTED'],
          },
        },
      })

      const productWithQuantityAvailable = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          quantityAvailable: true,
        },
      })

      const quantityTotal =
        productWithQuantityAvailable?.quantityAvailable || -1

      return {
        quantityTotal,
        purchaseCount,
        quantityAvailable: quantityTotal - purchaseCount,
      }
    }),
})
