import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {
  Exercise,
  ExerciseMedia,
  ExerciseMediaSchema,
  ExerciseSchema,
  getExerciseMedia,
} from '../../lib/exercises'

import {createAppAbility} from '../../ability/ability'
import {ContentRulesSchema, getContentRules} from '../get-content-rules'

export const exerciseRouter = createRouter()
  .query('bySlug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ctx, input}) {
      const exercise: Exercise = await sanityClient.fetch(
        groq`*[_type == "exercise" && slug.current == $slug][0]`,
        {slug: input.slug},
      )
      return ExerciseSchema.parse(exercise)
    },
  })
  .query('media', {
    input: ContentRulesSchema,
    async resolve({ctx, input}) {
      const rules = await getContentRules(ctx.req, input)
      const ability = createAppAbility(rules)

      if (input.lessonSlug && ability.can('view', 'Content')) {
        const exerciseMedia: ExerciseMedia = await getExerciseMedia(
          input.lessonSlug,
        )
        return ExerciseMediaSchema.parse(exerciseMedia)
      }
    },
  })
