import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const coursesQuery = groq`*[_type == "module"] | order(_createdAt desc) {
  title,
  description,
  ...
}`

export const getAllCourses = async () => await sanityClient.fetch(coursesQuery)
export const getAllLessons = async () => await sanityClient.fetch(lessonsQuery)

export const getModule = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && slug.current == $slug][0]{
      ...,
      resources[]->{
        "lessons": resources[]{
          title, 
          "slug": slug.current,
        },
        ...
      },
      "image": image.asset->url
  }`,
    {slug: `${slug}`},
  )
