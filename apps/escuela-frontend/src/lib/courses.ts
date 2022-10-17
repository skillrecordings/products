import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const coursesQuery = groq`*[_type == "module"] | order(_createdAt desc) {
  title,
  description,
  ...
}`

export const getAllCourses = async () => await sanityClient.fetch(coursesQuery)

export const getModule = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && slug.current == $slug][0]{
     title, 
     'id': _id, 
     'slug': slug.current,
     'image': image.asset->url,
     description, 
     body,
     'sections': resources[]->{
        'sectionTitle': title,
        'sectionSlug': slug.current,
          ..., 
     'lessons': resources[]->{
        'lessonTitle': title,
        'lessonSlug': slug.current,
      ...,
     }
    }
  }`,
    {slug: `${slug}`},
  )
