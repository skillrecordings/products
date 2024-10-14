import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getWorkshop} from 'lib/workshops'
import {getTutorial} from 'lib/tutorials'

export const moduleResourcesRouter = router({
  byModuleSlug: publicProcedure
    .input(
      z.object({
        slug: z.string().optional().nullable(),
        moduleType: z.string().optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      if (!input.slug) {
        return null
      }
      let module
      if (input.moduleType === 'workshop') {
        module = await getWorkshop(input.slug)
      }
      if (input.moduleType === 'tutorial') {
        module = await getTutorial(input.slug)
      }

      const github = module.github
      const workshopApp = module.workshopApp

      return {github, workshopApp}
    }),
})
