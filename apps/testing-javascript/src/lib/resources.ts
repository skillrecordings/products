import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'

export const getAllProducts = async () =>
  await sanityClient.fetch(groq`*[_type == "product"] {
  productId,
  image {
    url
  },
  title,
  description,
  "modules": modules[]->{
    "id": _id,
    title,
    image {
      url
    },
    "slug": slug.current,
    description,
    body,
    "lessons": resources[@->._type in ['explainer']]->{
      "id": _id,
      "updatedAt": _updatedAt,
      title,
      "description": body[0].children[0].text,
      "slug": slug.current,
      "videoResourceId": resources[@->._type == 'videoResource'][0]->_id
    }
  }
}`)

export const getProductById = async (productId: string) =>
  await sanityClient.fetch(
    groq`*[_type == "product" && productId == $productId] {
      productId,
      image {
        url
      },
      title,
      description,
      "modules": modules[]->{
        "id": _id,
        title,
        image {
          url
        },
        "slug": slug.current,
        description,
        body,
        "lessons": resources[@->._type in ['explainer']]->{
          "id": _id,
          "updatedAt": _updatedAt,
          title,
          description,
          body,
          "slug": slug.current,
          "videoResourceId": resources[@->._type == 'videoResource'][0]->_id
        }
      }
    }`,
    {productId: `${productId}`},
  )

export const getAllWorkshops = async () =>
  await sanityClient.fetch(groq`*[_type == "module" && moduleType == 'workshop'] {
        "id": _id,
        title,
        state,
        "slug": slug.current,
        description,
        body,
        "updatedAt": _updatedAt,
        image {
          url
        },
        "lessons": resources[@->._type in ['explainer']]->{
          "id": _id,
          "updatedAt": _updatedAt,
          title,
          description,
          body,
          "slug": slug.current,
          "videoResourceId": resources[@->._type == 'videoResource'][0]->_id
        }
    }`)

export const getWorkshopBySlug = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'workshop' && slug.current == $slug][0]{
        "id": _id,
        title,
        state,
        "slug": slug.current,
        description,
        body,
        "updatedAt": _updatedAt,
        image {
          url
        },
        "lessons": resources[@->._type in ['explainer']]->{
          "id": _id,
          "updatedAt": _updatedAt,
          title,
          description,
          body,
          "slug": slug.current,
          "videoResourceId": resources[@->._type == 'videoResource'][0]->_id
        }
    }`,
    {slug: `${slug}`},
  )

export const getLessonBySlug = async (slug: string) =>
  await sanityClient.fetch(
    groq`*[_type in ["explainer"] && slug.current == $slug][0]{
      "id": _id,
      _updatedAt,
      title,
      description,
      body,
      "slug": slug.current,
      "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
      "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
    }`,
    {slug: `${slug}`},
  )
