import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

const tutorialsQuery = groq`*[_type == "module" && moduleType == 'playlist' && state == 'published'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  "lessons": resources[@->._type in ['interview']]->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current
    }
}`

export const getAllPlaylists = async () =>
  await sanityClient.fetch(tutorialsQuery)

export const getPlaylist = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'playlist' && slug.current == $slug][0]{
        "id": _id,
        _type,
        title,
        state,
        slug,
        body[]{
          ...,
          _type == "bodyTestimonial" => {
            "body": testimonial->body,
            "author": testimonial->author {
              "image": image.asset->url,
              name
            }
        }
        },
        moduleType,
        _id,
        github,
        ogImage,
        description,
        _updatedAt,
        "lessons": resources[@->._type in ['interview']]->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current
        },
        "image": image.asset->url
    }`,
    {slug: `${slug}`},
  )
