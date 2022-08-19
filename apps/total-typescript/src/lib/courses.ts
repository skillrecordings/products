import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const coursesQuery = groq`*[_type == "course"] {
  "slug": slug.current
  }`

export const getAllCourses = async () => await sanityClient.fetch(coursesQuery)
export const getCourse = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "course" && slug.current == $slug][0]{
        title,
        "slug": slug.current,
        "coursePath": slug.current,
        body,
        _id,
        resources[]->{
            _type,
            title,
            "slug": slug.current,
            resources[]->{
              _type,
              title,
              "slug": slug.current
            }
        },
        "image": image.asset->url
    }`,
    {slug: `${slug}`},
  )
