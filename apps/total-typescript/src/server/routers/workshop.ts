import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {getWorkshop} from '../../lib/workshops'

export const workshop = createRouter().query('bySlug', {
  input: z.object({
    slug: z.string(),
  }),
  async resolve({ctx, input}) {
    return await getWorkshop(input.slug)
  },
})
