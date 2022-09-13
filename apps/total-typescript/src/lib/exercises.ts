import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const ExerciseSchema = z.object({
  _id: z.string(),
  label: z.string(),
  slug: z.object({
    current: z.string(),
  }),
  _type: z.string(),
  _updatedAt: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.any().array(),
  resources: z.any().array(),
})

export type Exercise = z.infer<typeof ExerciseSchema>

export const getExercise = async (slug: string): Promise<Exercise> => {
  const exercise = await sanityClient.fetch(
    groq`*[_type == "exercise" && slug.current == $slug][0]`,
    {slug: `${slug}`},
  )

  return ExerciseSchema.parse(exercise)
}
