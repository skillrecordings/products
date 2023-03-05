import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'

const productsQuery = groq`*[_type == "pricing"][0] {
  title,
  subtitle,
  "products": products[]->{
  "name": title,
  productId,
  description,
  action,
  image {
    url,
    alt
  },
  modules[]->{
    title,
    "image": image.asset->{url, alt},
    state
  },
  features[]{
    value
  }
  }
}`

export const getActiveProducts = async () =>
  (await sanityClient.fetch(productsQuery)) || {
    products: [
      {
        name: 'Pro',
        productId: process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
      },
    ],
  }

export const getProductModules = async (productIds: string[]) => {
  const product = await sanityClient.fetch(
    groq`*[_type == 'product' && productId in $productIds][]{
    _id,
    productId,
    "modules" : modules[]->{
    _id,
    "slug": slug.current}
    }`,
    {
      productIds,
    },
  )
  return product
}

export const getProduct = async (productId: string) => {
  const product = await sanityClient.fetch(
    groq`*[_type == 'product' && productId == $productId][0] {
     "name": title,
     image {
      url
     }
    }`,
    {
      productId,
    },
  )
  return product
}
