import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

const productsQuery = groq`*[_type == "module" && moduleType == 'workshop' && !(null in resources[].productId)] | order(_createdAt desc) {
  _id,
  _type,
  title,
  "name": 'Professional Workshop',
  "slug": slug.current,
  "image": {"url": image.asset->url},
  _updatedAt,
  _createdAt,
  description,
  state,
  resources,
  "productId": resources[@._type == 'product'][0].productId,
  "convertkitPurchasedTagId": resources[@._type == 'product'][0].convertkitPurchasedTagId,
  "features": resources[@._type == 'product'][0].features,
  "instructor": {
    "name": "Simon Vrachliotis",
    "image": "/assets/simon-vrachliotis.png",
  },
  "lessons": resources[@->._type == 'section'][0]->.resources[]->{
    ...
  }
}`

const productQuery = groq`*[_type == "module" && moduleType == 'workshop' && $productId in resources[].productId][0] {
  _id,
  _type,
  title,
  "name": 'Professional Workshop',
  "slug": slug.current,
  "image": {"url": image.asset->url},
  _updatedAt,
  _createdAt,
  description,
  state,
  resources[]->,
  "sections": resources[@->._type == 'section']->{
    "slug": slug.current
  },
  "lessons": resources[@->._type == 'section']->resources[@->._type in ['exercise', 'explainer']]->{
    _id,
    "slug": slug.current
  },
  "productId": resources[@._type == 'product'][0].productId,
  "convertkitPurchasedTagId": resources[@._type == 'product'][0].convertkitPurchasedTagId,
  "features": resources[@._type == 'product'][0].features,
  "instructor": {
    "name": "Simon Vrachliotis",
    "image": "/assets/simon-vrachliotis.png",
  }
}`

export const getActiveProducts = async () =>
  await sanityClient.fetch(productsQuery)

export const getActiveProduct = async (productId: string) => {
  const product = await sanityClient.fetch(productQuery, {
    productId,
  })
  return product
}
