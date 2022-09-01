import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const lessonsQuery = groq`*[_type == "lesson"] {
  "slug": slug.current
  }`

const freeLessonsQuery = groq`*[_type == "lesson" && isFree == true] {
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
export const getBlockedLesson = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "lesson" && slug.current == $slug][0]{
        // video,
        // transcript,
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
