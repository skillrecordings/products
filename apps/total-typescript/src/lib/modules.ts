import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

const modulesQuery = groq`*[_type == "module"] {
  "slug": slug.current
  }`

export const getAllModules = async () => await sanityClient.fetch(modulesQuery)
export const getModule = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && slug.current == $slug][0]{
        title,
        "slug": slug.current,
        body,
        moduleType,
        _id,
        github,
        resources[]->{
            _type,
            title,
            lessonType,
            stackblitz,
            "slug": slug.current,
            resources[]->{
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
