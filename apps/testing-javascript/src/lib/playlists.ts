import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

const workshopsQuery = groq`*[_type == "module" && moduleType == 'workshop'] | order(_createdAt desc) {
  _id,
  _type,
  title,
  slug,
  "image": image.url,
  _updatedAt,
  _createdAt,
  description,
  'durationInSeconds': duration,
  state,
  body,
  preview,
  "introPlaybackId": resources[@->._type == 'section'][0]->resources[@->._type in ['exercise', 'explainer']][0]->resources[@->._type == 'videoResource'][0]->{
    "muxPlaybackId": muxAsset.muxPlaybackId,
  }.muxPlaybackId,
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

export const getAllPlaylists = async () =>
  await sanityClient.fetch(workshopsQuery)

export const getPlaylist = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'workshop' && slug.current == $slug][0]{
        "id": _id,
        _type,
        title,
        state,
        slug,
        "durationInSeconds": duration,
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
        preview,
        moduleType,
        _id,
        github,
        ogImage,
        description,
        _updatedAt,
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
            body,
            "durationInSeconds": resources[@->._type == 'videoResource'][0]->duration,
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
        "image": image.url
    }`,
    {slug: `${slug}`},
  )
