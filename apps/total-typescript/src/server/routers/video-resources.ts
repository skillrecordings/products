import {publicProcedure, router} from '../trpc'
import {z} from 'zod'
import {getVideoResource} from 'lib/video-resource'

export const videoResourceRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      // we could do access control authorization here
      return await getVideoResource(input.id)
    }),
})
