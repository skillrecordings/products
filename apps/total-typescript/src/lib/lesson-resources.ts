import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {BaseLessonResourceSchema} from '../schemas/base-lesson-resource'

export const LessonResourceSchema = z
  .object({
    _id: z.string().optional(),
    _key: z.string().optional(),
  })
  .merge(BaseLessonResourceSchema)

export type LessonResource = z.infer<typeof LessonResourceSchema>

export const getLessonResource = async (
  slug: string,
): Promise<LessonResource> => {
  const exercise = await sanityClient.fetch(
    `*[_type in ['exercise', 'explainer'] && slug.current == $slug][0]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
      body,
    }`,
    {slug},
  )

  return LessonResourceSchema.parse(exercise)
}

export const getAllLessonResources = async (): Promise<LessonResource[]> => {
  const exercises =
    await sanityClient.fetch(groq`*[_type in ['exercise', 'explainer']]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      body,
      "slug": slug.current

    }`)

  return z.array(LessonResourceSchema).parse(exercises)
}
