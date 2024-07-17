import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getTutorial} from '@/lib/tutorials'

export const moduleResourcesRouter = router({
  byModuleSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const module = await getTutorial(input.slug)

      const github = module.github
      const workshopApp = module.workshopApp

      return {github, workshopApp}
    }),
})
