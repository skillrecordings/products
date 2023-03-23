import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getActiveProducts} from '../../lib/resources'

export const resourcesRouter = router({
  getAllProducts: publicProcedure.query(async ({ctx}) => {
    const products = await getActiveProducts()
    return products
  }),
})
