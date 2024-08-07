import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

const productsQuery = groq`*[_type == "product"] | order(_createdAt desc) {
  _id,
  _type,
  _updatedAt,
  title,
  "name": title,
  productId,
  description,
  summary,
  image,
  action,
  features,
  "modules": modules[@->._type == 'module']->{
    _id,
    _type,
    title,
    image,
    "slug": slug.current,
    state
  }
}`

const productQuery = groq`*[_type == "product" && productId == $productId][0] {
  _id,
  _type,
  _updatedAt,
  title,
  "name": title,
  productId,
  description,
  summary,
  image,
  action,
  features,
  "modules": modules[@->._type == 'module']->{
    _id,
    _type,
    title,
    image,
    "slug": slug.current,
    state,
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
        title,
        "slug": slug.current
      }
    }
  }
}`

export const getAllProducts = async () =>
  await sanityClient.fetch(productsQuery)

export const getActiveProduct = async (productId: string) => {
  const product = await sanityClient.fetch(productQuery, {
    productId,
  })
  return product
}
