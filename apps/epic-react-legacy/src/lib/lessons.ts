import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import {z} from 'zod'

export const LessonSchema = z.object({
  _id: z.string(),
  _type: z.enum(['exercise', 'explainer', 'interview']),
  _updatedAt: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  body: z.any(), // figure out how to type this better
  videoResourceId: z.string(),
  transcript: z.any().array(),
})

export const getLesson = async (slug: string) => {
  const exercise = await sanityClient.fetch(
    `*[_type in ['exercise', 'explainer', 'interview'] && slug.current == $slug][0]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
      body,
      "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
    }`,
    {slug},
  )

  return LessonSchema.parse(exercise)
}

export const getAllLessons = async () => {
  const lessons =
    await sanityClient.fetch(groq`*[_type in ['exercise', 'explainer', 'interview']]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
      body,
      "videoResourceId": resources[@->._type == 'videoResource'][0],
    }`)

  return LessonSchema.array().parse(lessons)
}
