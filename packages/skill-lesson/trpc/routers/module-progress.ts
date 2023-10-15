import {publicProcedure, router} from '../trpc.server'
import {z} from 'zod'
import {getToken} from 'next-auth/jwt'
import {getModuleProgress} from '../../lib/module-progress'

export const moduleProgressRouter = router({
  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().nullish(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token?.sub || !input.slug) {
        return null
      }

      return getModuleProgress({moduleSlug: input.slug, userId: token.sub})
    }),
})
