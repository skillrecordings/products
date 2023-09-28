import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'

const modulesQuery = groq`*[_type == "module" && state == 'published'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  "product": resources[@._type == 'product'][0]{productId},
  "lessons": resources[@->._type in ['lesson', 'exercise', 'explainer']]->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current,
    "solution": resources[@._type == 'solution'][0]{
      _key,
      _type,
      "_updatedAt": ^._updatedAt,
      title,
      description,
      "slug": slug.current,
    },
    }
}`

export const getAllModules = async () => await sanityClient.fetch(modulesQuery)

export const getModule = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && slug.current == $slug][0]{
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
        "image": image.asset->url,
        "product": resources[@._type == 'product'][0]{productId},
        "sections": resources[@->._type == 'section']->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current,
          "lessons": resources[@->._type in ['lesson', 'exercise', 'explainer']]->{
            _id,
            _type,
            _updatedAt,
            title,
            description,
            "slug": slug.current,
            "solution": resources[@._type == 'solution'][0]{
              _key,
              _type,
              "_updatedAt": ^._updatedAt,
              title,
              description,
              "slug": slug.current,
            }
          },
          "resources": resources[@->._type in ['linkResource']]->
        },
        "lessons": resources[@->._type in ['lesson', 'exercise', 'explainer', 'interview']]->{
          _id,
          _type,
          _updatedAt,
          title,
          description,
          "slug": slug.current,
          "solution": resources[@._type == 'solution'][0]{
            _key,
            _type,
            "_updatedAt": ^._updatedAt,
            title,
            description,
            "slug": slug.current,
          }
        },
    }`,
    {slug: `${slug}`},
  )
export const getModuleById = async (id: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && _id == $id][0]{
        "id": _id,
        _type,
        title,
        "slug": slug.current,
        "image": image.asset->url,
    }`,
    {id: `${id}`},
  )
