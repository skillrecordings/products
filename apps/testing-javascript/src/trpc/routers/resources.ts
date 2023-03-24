import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {
  getAllProducts,
  getProductById,
  getWorkshopBySlug,
} from '../../lib/resources'

export const resourcesRouter = router({
  getAllProducts: publicProcedure.query(async ({ctx}) => {
    const products = await getAllProducts()
    return products
  }),
  getProductById: publicProcedure
    .input(z.object({productId: z.string()}))
    .query(async ({ctx, input}) => {
      const product = await getProductById(input.productId)
      return product
    }),
  getWorkshopBySlug: publicProcedure
    .input(z.object({slug: z.string()}))
    .query(async ({ctx, input}) => {
      const workshop = await getWorkshopBySlug(input.slug)
      return workshop
    }),
})
