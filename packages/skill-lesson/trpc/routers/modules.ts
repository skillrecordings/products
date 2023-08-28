import {z} from 'zod'
import {publicProcedure, router} from '../trpc.server'
import {defineAbilityRulesForResource} from '../../utils/define-resource-ability-rules'

export const modulesRouter = router({
  rules: publicProcedure
    .input(
      z.object({
        moduleSlug: z.string().nullish(),
        moduleType: z.string().optional(),
        lessonSlug: z.string().optional(),
        sectionSlug: z.string().optional(),
        isSolution: z.boolean().default(false).optional(),
        convertkitSubscriberId: z.number().optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {moduleSlug, lessonSlug, sectionSlug, isSolution} = input
      const abilityRules = await defineAbilityRulesForResource({
        req: ctx.req,
        moduleSlug,
        lessonSlug,
        sectionSlug,
        isSolution,
      })

      return abilityRules as any
    }),
})
