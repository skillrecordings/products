import {z} from 'zod'
import {publicProcedure, router} from '../trpc.server'
import {getVideoResource} from '../../lib/video-resources'

export const videoResourceRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      return await getVideoResource(input.id)
    }),
})
