import {z} from 'zod'
import {publicProcedure, router} from '../trpc.server'
import {getVideoResource} from '../../lib/video-resources'
import {defineAbilityRulesForResource} from '../../utils/define-resource-ability-rules'
import {createAppAbility} from '../../utils/ability'

export const videoResourceRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
        moduleSlug: z.string().nullish(),
        lessonSlug: z.string(),
        sectionSlug: z.string().optional(),
      }),
    )
    .query(async ({ctx, input}) => {
      const {moduleSlug, sectionSlug, lessonSlug} = input
      const abilityRules = await defineAbilityRulesForResource({
        req: ctx.req,
        moduleSlug,
        sectionSlug,
        lessonSlug,
      })
      const ability = createAppAbility(abilityRules || [])
      const canShowVideo = ability.can('view', 'Content')

      if (canShowVideo) {
        return await getVideoResource(input.id)
      }
      return null
    }),
})
