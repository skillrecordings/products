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
  resources[]->{
    ...,
    "parentPath": ^.slug.current,
    resources[]->{
    ...
  }
  }
  }`

export const getAllTutorials = async () =>
  await sanityClient.fetch(tutorialsQuery)

export const getTutorial = async (slug: string) =>
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
        resources[]->{
            "id": _id,
            _type,
            title,
            lessonType,
            stackblitz,
            "slug": slug.current,
            resources[]->{
              "id": _id,
              _type,
              title,
              lessonType,
              stackblitz,
              "slug": slug.current
            }
        },
        "image": image.asset->url
    }`,
    {slug: `${slug}`},
  )
