import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

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

export const getLesson = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "lesson" && slug.current == $slug][0]{
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
export const getBlockedLesson = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "lesson" && slug.current == $slug][0]{
        // video,
        transcript,
        description,
          _updatedAt,
        isFree,
        title,
        "slug": slug.current,
        lessonType,
        github,
        body,
        stackblitz {
          projectId,
          openFile
        }
    }`,
    {slug: `${slug}`},
  )
