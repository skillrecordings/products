import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const modulesQuery = groq`*[_type == "module"] {
  "slug": slug.current
  }`

export const getAllModules = async () => await sanityClient.fetch(modulesQuery)
export const getModule = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && slug.current == $slug][0]{
        "id": _id,
        title,
        "slug": slug.current,
        body,
        moduleType,
        _id,
        github,
        ogImage,
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
