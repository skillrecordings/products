import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

const tutorialsQuery = groq`*[_type == "module" && moduleType == 'tutorial' && state == 'published'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  moduleType,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  state,
  "cta": resources[@->._type == 'cta'][0]->{body, expiresAt},
  "sections": resources[@->._type == 'section']->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current,
    "lessons": resources[@->._type in ['exercise', 'explainer']]->{
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
  }
}`

export const getAllTutorials = async () =>
  await sanityClient.fetch(tutorialsQuery)

export const getTutorial = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'tutorial' && slug.current == $slug][0]{
      "id": _id,
      _type,
      title,
      state,
      slug,
      moduleType,
      _id,
      github,
      ogImage,
      description,
      _updatedAt,
      "image": image.asset->url,
      "cta": resources[@->._type == 'cta'][0]->{body, expiresAt},
      body,
      "testimonials": resources[@->._type == 'testimonial']->{
        _id,
        _type,
        _updatedAt,
        body,
        author {
          name,
          "image": image.asset->url
        }
      },
      "sections": resources[@->._type == 'section']->{
        _id,
        _type,
        _updatedAt,
        title,
        description,
        "slug": slug.current,
        "lessons": resources[@->._type in ['exercise', 'explainer']]->{
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
      }
    }`,
    {slug: `${slug}`},
  )
