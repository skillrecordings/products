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
  body: z.any().array(),
  stackblitz: z.string().optional(),
  muxPlaybackId: z.nullable(z.string()).optional(),
  transcript: z.nullable(z.any().array()),
  solution: z.nullable(z.any().array()),
})

export type Lesson = z.infer<typeof LessonSchema>

export const getLessonMuxPlaybackId = async (lessonSlug: string) => {
  const lessonVideo = await sanityClient.fetch(
    `
  *[_type == "lesson" && slug.current == $slug][0]
    .resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId`,
    {slug: `${lessonSlug}`},
  )

  return z.string().nullish().parse(lessonVideo)
}

export const getLesson = async (slug: string): Promise<Lesson> => {
  const lesson = await sanityClient.fetch(
    groq`*[_type == "lesson" && slug.current == $slug][0]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      body,
      "slug": slug.current,
      "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
      "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
      "solution": resources[@._type == 'solution'][]{
        _key,
        _type,
        "_updatedAt": ^._updatedAt,
        title,
        description,
        body,
        "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
      }
    }`,
    {slug: `${slug}`},
  )

  return LessonSchema.parse(lesson)
}

export const getAllLessons = async (): Promise<Lesson[]> => {
  const lessons = await sanityClient.fetch(groq`*[_type == "lesson"]{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      body,
      "slug": slug.current,
      "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
      "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        _updatedAt,
        title,
        description,
        body,
        "stackblitz": resources[@._type == 'stackblitz'][0].openFile,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
       "slug": slug.current
       }
    }`)

  return z.array(LessonSchema).parse(lessons)
}
