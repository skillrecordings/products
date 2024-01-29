import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getWorkshop} from 'lib/workshops'

export const moduleResourcesRouter = router({
  byModuleSlug: publicProcedure
    .input(
      z.object({
        slug: z.string().optional().nullable(),
      }),
    )
    .query(async ({ctx, input}) => {
      if (!input.slug) {
        return null
      }
      const module = await getWorkshop(input.slug)

      const github = module.github
      const workshopApp = module.workshopApp

      return {github, workshopApp}
    }),
})
