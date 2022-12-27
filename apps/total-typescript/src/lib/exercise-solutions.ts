import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {BaseLessonResourceSchema} from '../schemas/base-lesson-resource'

export const SolutionSchema = z
  .object({
    _key: z.string().optional(),
  })
  .merge(BaseLessonResourceSchema)

export type Solution = z.infer<typeof SolutionSchema>

export const getSolution = async (slug: string): Promise<Solution> => {
  const exercise = await sanityClient.fetch(
    `*[_type in ['exercise', 'explainer'] && slug.current == $slug][0].resources[@._type == 'solution'][0]{
        _key,
        _type,
        "_updatedAt": ^._updatedAt,
        title,
        description,
        body,
        slug
      }`,
    {slug},
  )

  return SolutionSchema.parse(exercise)
}

export const getAllSolutions = async (): Promise<Solution[]> => {
  const exercises =
    await sanityClient.fetch(groq`*[_type in ['exercise', 'explainer']].resources[@._type == 'solution'][0]{
        _key,
        _type,
        _updatedAt,
        title,
        description,
        body,
        slug
       }`)

  return z.array(SolutionSchema).parse(exercises)
}
