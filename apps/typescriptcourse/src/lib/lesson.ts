import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {BaseLessonResourceSchema} from '@skillrecordings/skill-lesson/schemas/base-lesson-resource'

export const LessonSchema = z
  .object({
    _id: z.string().optional(),
    _key: z.string().optional(),
    videoResourceId: z.nullable(z.string()).optional(),
    transcript: z.nullable(z.any().array()).optional(),
    github: z
      .object({
        url: z.string(),
      })
      .optional()
      .nullable(),
  })
  .merge(BaseLessonResourceSchema)

export type Lesson = z.infer<typeof LessonSchema>
export const LessonsSchema = z.array(LessonSchema)

export const getLesson = async (
  slug: string,
  includeMedia: boolean = true,
): Promise<Lesson> => {
  const query = groq`*[_type in ["lesson", "explainer"] && slug.current == $slug][0]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
      ${
        includeMedia
          ? `      
        body,
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
       "github": resources[@._type == 'github'][0] {
        url
      },
        `
          : ''
      }
       "github": resources[@._type == 'github'][0] {
        url
      },
    }`

  const lesson = await sanityClient.fetch(query, {slug: `${slug}`})

  return LessonSchema.parse(lesson)
}

export const getAllLessons = async (): Promise<Lesson[]> => {
  const lessons =
    await sanityClient.fetch(groq`*[_type in ["lesson", "explainer"]]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      body,
      "slug": slug.current,
      "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
    }`)

  return LessonsSchema.parse(lessons)
}
