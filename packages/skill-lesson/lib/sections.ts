import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'

const sectionsQuery = groq`*[_type == "module" && moduleType == 'section'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
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
}`

export const getAllSections = async () =>
  await sanityClient.fetch(sectionsQuery)

export const getSection = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "section" && slug.current == $slug][0]{
        "id": _id,
        _type,
        title,
        state,
         "slug": slug.current,
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
        "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson']]->{
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
        "resources": resources[@->._type in ['linkResource']]->,
        "image": image.asset->url
    }`,
    {slug: `${slug}`},
  )
