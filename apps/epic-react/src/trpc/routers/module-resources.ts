import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getTutorial} from '@/lib/tutorials'
import {getWorkshop} from '@/lib/workshops'

export const moduleResourcesRouter = router({
  byModuleSlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        moduleType: z.enum(['tutorial', 'workshop']),
      }),
    )
    .query(async ({ctx, input}) => {
      let module

      if (input.moduleType === 'tutorial') {
        module = await getTutorial(input.slug)
      } else if (input.moduleType === 'workshop') {
        module = await getWorkshop(input.slug)
      } else {
        throw new Error('Invalid module type')
      }

      const github = module.github
      const workshopApp = module.workshopApp

      return {github, workshopApp}
    }),
})
