import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {Exercise, ExerciseSchema} from '../../lib/exercises'

export const exerciseRouter = createRouter().query('bySlug', {
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
