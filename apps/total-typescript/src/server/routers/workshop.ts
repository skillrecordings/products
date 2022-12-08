import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {getWorkshop} from '../../lib/workshops'

import {ContentRulesSchema, getContentRules} from '../get-content-rules'

export const workshop = createRouter()
  .query('bySlug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ctx, input}) {
      return await getWorkshop(input.slug)
    },
  })
  .query('verifyAccess', {
    input: ContentRulesSchema,
    async resolve({ctx, input}) {
      return await getContentRules(ctx.req, input)
    },
  })
