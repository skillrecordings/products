import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const tutorialsQuery = groq`*[_type == "module" && moduleType == 'tutorial'] {
  _id,
  _type
  title,
  slug,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  "exercises": resources[@->._type == 'exercise']->,
}`

export const getAllTutorials = async () =>
  await sanityClient.fetch(tutorialsQuery)

export const getModule = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'tutorial' && slug.current == $slug][0]{
        "id": _id,
        _type,
        title,
        slug,
        body,
        moduleType,
        _id,
        github,
        ogImage,
        description,
        _updatedAt,
        "exercises": resources[@->._type == 'exercise']->,
        "image": image.asset->url
    }`,
    {slug: `${slug}`},
  )
