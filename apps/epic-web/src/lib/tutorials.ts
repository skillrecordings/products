import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

export const getAllTutorials = async (onlyPublished = true) => {
  const tutorials = await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'tutorial' ${
      onlyPublished ? ` && state == 'published'` : ''
    }] | order(_createdAt desc) {
    _id,
    _type,
    title,
    slug,
    "image": image.asset->url,
    _updatedAt,
    _createdAt,
    description,
    moduleType,
    state,
    author-> {
      name,
      "slug": slug.current,
      "image": picture.asset->url,
      "imageAlt": picture.alt
    },
    "sections": resources[@->._type == 'section']->{
      _id,
      _type,
      _updatedAt,
      title,
      description,
      "slug": slug.current,
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
    }
  }`,
  )
  return tutorials
}
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
      body,
      author-> {
          name,
          "slug": slug.current,
          "image": picture.asset->url,
          "imageAlt": picture.alt
        },
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
      }
    }`,
    {slug: `${slug}`},
  )
