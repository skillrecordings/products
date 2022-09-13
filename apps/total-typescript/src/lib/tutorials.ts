import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const tutorialsQuery = groq`*[_type == "module" && moduleType == 'tutorial'] {
  _id,
  title,
  "slug": slug.current,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  "exercises": resources[@->._type == 'exercise']->,
  "resources": resources[@->._type != 'exercise']->{
    ...,
    "parentPath": ^.slug.current,
    resources[]->{
    ...
  }
  }
  }`

export const getAllTutorials = async () =>
  await sanityClient.fetch(tutorialsQuery)

export const getModule = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'tutorial' && slug.current == $slug][0]{
        "id": _id,
        title,
        "slug": slug.current,
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
