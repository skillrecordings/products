import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

const workshopsQuery = groq`*[_type == "module" && moduleType == 'workshop'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  "image": image.asset->url,
  _updatedAt,
  _createdAt,
  description,
  state,
  "product": resources[@._type == 'product'][0]{productId},
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
            "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
      "solution": resources[@._type == 'solution'][0]{
        _key,
        _type,
        "_updatedAt": ^._updatedAt,
        title,
        description,
              "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "slug": slug.current,
      }
    },
    "resources": resources[@->._type in ['linkResource']]->
  }
}`

export const getAllWorkshops = async () =>
  await sanityClient.fetch(workshopsQuery)

export const getWorkshop = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'workshop' && slug.current == $slug][0]{
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
        "product": resources[@._type == 'product'][0]{productId},
        resources,
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
                  "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
            "solution": resources[@._type == 'solution'][0]{
              _key,
              _type,
              "_updatedAt": ^._updatedAt,
              title,
              description,
                    "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
              "slug": slug.current,
            }
          },
          "resources": resources[@->._type in ['linkResource']]->
        },
        "image": image.asset->url
    }`,
    {slug: `${slug}`},
  )
