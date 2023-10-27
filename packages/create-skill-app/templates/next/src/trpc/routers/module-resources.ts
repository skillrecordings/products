import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getWorkshop} from '@/lib/workshops'

export const moduleResourcesRouter = router({
  byModuleSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const module = await getWorkshop(input.slug)

      const github = module.github

      return {github}
    }),
})
