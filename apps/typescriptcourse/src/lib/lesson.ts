import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const LessonSchema = z.object({
  _id: z.string().optional(),
  _key: z.string().optional(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.any().array().optional().nullable(),
  muxPlaybackId: z.nullable(z.string()).optional(),
  transcript: z.nullable(z.any().array()).optional(),
  github: z
    .object({
      url: z.string(),
    })
    .optional()
    .nullable(),
})

export type Lesson = z.infer<typeof LessonSchema>
export const LessonsSchema = z.array(LessonSchema)

export const getLessonMuxPlaybackId = async (lessonSlug: string) => {
  const lessonVideo = await sanityClient.fetch(
    `
  *[_type == "lesson" && slug.current == $slug][0]
    .resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId`,
    {slug: `${lessonSlug}`},
  )

  return z.string().nullish().parse(lessonVideo)
}

export const getLessonMedia = async (lessonSlug: string) => {
  const lessonMedia = await sanityClient.fetch(
    groq`*[_type == "lesson" && slug.current == $slug][0]{
      "slug": slug.current,
      body,
      "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
      }
    }`,
    {slug: `${lessonSlug}`},
  )

  return lessonMedia
}

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
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
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
      "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
    }`)

  return LessonsSchema.parse(lessons)
}
