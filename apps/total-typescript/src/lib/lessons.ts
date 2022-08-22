import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const lessonsQuery = groq`*[_type == "lesson"] {
  "slug": slug.current
  }`

export const getAllLessons = async () => await sanityClient.fetch(lessonsQuery)
export const getLesson = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "lesson" && slug.current == $slug][0]{
        title,
        "slug": slug.current,
        video,
        body,
        transcript,
        stackblitz {
          projectId,
          openFile
        }
    }`,
    {slug: `${slug}`},
  )
