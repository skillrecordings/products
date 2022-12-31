import groq from 'groq'
import z from 'zod'
import {BaseLessonResourceSchema} from '../schemas/base-lesson-resource'
import {sanityClient} from '../utils/sanity-client'

export const LessonSchema = z
  .object({
    _id: z.string().optional(),
    _key: z.string().optional(),
    stackblitz: z.nullable(z.string()).optional(),
    videoResourceId: z.nullable(z.string()).optional(),
    transcript: z.nullable(z.any().array()).optional(),
    solution: z.nullable(
      z
        .object({
          _key: z.string(),
          stackblitz: z.nullable(z.string()).optional(),
          videoResourceId: z.nullable(z.string()).optional(),
          transcript: z.nullable(z.any().array()).optional(),
        })
        .merge(BaseLessonResourceSchema)
        .optional(),
    ),
  })
  .merge(BaseLessonResourceSchema)

export type Lesson = z.infer<typeof LessonSchema>

export const getLesson = async (slug: string): Promise<Lesson> => {
  const exercise = await sanityClient.fetch(
    `*[_type in ['exercise', 'explainer'] && slug.current == $slug][0]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
      body,
      "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        "_updatedAt": ^._updatedAt,
        title,
        description,
        body,
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "slug": slug.current,
      }
    }`,
    {slug},
  )

  return LessonSchema.parse(exercise)
}

export const getAllLessons = async (): Promise<Lesson[]> => {
  const exercises =
    await sanityClient.fetch(groq`*[_type in ['exercise', 'explainer']]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      body,
      "slug": slug.current,
      "videoResourceId": resources[@->._type == 'videoResource'][0],
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        _updatedAt,
        title,
        description,
        body,
        "videoResourceId": resources[@->._type == 'videoResource'][0],
       "slug": slug.current
       }
    }`)

  return z.array(LessonSchema).parse(exercises)
}
