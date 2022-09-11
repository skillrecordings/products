import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'
import z from 'zod'

const lessonsQuery = groq`*[_type == "lesson"] {
  _updatedAt,
  "slug": slug.current
  }`

const freeLessonsQuery = groq`*[_type == "lesson" && isFree == true] {
  _updatedAt,
  "slug": slug.current
  }`

export const getAllLessons = async () => await sanityClient.fetch(lessonsQuery)
export const getFreeLessons = async () =>
  (await sanityClient.fetch(freeLessonsQuery)) as {slug: string}[]

export const LessonSchema = z.object({
  id: z.string(),
  video: z.string(),
  transcript: z.array(z.any()),
  description: z.nullable(z.string()),
  isFree: z.boolean(),
  title: z.string(),
  slug: z.string(),
  lessonType: z.string(),
  github: z.nullable(z.string()),
  body: z.any(),
  _updatedAt: z.string(),
  stackblitz: z.object({
    projectId: z.nullable(z.string()),
    openFile: z.string(),
  }),
})

export type Lesson = z.infer<typeof LessonSchema>

export const getLesson = async (slug: string): Promise<Lesson> => {
  const lesson = await sanityClient.fetch(
    groq`*[_type == "lesson" && slug.current == $slug][0]{
        "id": _id,
        video,
        transcript,
        description,
        isFree,
        title,
        "slug": slug.current,
        lessonType,
        github,
        body,
          _updatedAt,
        stackblitz {
          projectId,
          openFile
        }
    }`,
    {slug: `${slug}`},
  )

  return LessonSchema.parse(lesson) as Lesson
}
