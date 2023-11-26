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

export const getProducts = async (productIds: string[]) => {
  const products = await sanityClient.fetch(
    groq`*[_type == 'product' && productId in $productIds][]{
    _id,
    productId,
    "modules" : modules[]->{
    _id,
    "features" : features[]{
    value
   },
    "slug": slug.current}
    }`,
    {
      productIds,
    },
  )
  return products
}

export const getAllProducts = async () => {
  const products = await sanityClient.fetch(
    groq`*[_type == 'product'][]{
    _id,
    title,
    description,
    productId,
    state,
    "slug": slug.current,
    _id,
    image {
      url,
      alt
    },
    "modules" : modules[]->{
      title,
      moduleType,
      "slug": slug.current,
      "image": image.asset->{url},
      state,
    },
    "bonuses": *[_type == 'bonus'][]{...},
    "features" : features[]{
    value
   }
    }`,
  )
  return products
}

export const getModuleProducts = async (productIds: string[]) => {
  const products = await sanityClient.fetch(
    groq`*[_type == "module" && moduleType == 'workshop' && !(null in resources[].productId)] | order(_createdAt desc) {
    _id,
    resources,
    "productId": resources[@._type == 'product'][0].productId,
    }`,
    {
      productIds,
    },
  )
  return products.map((product: any) => {
    // product can also be a module with product resource
    // TODO: adjust logic in here: https://github.com/skillrecordings/products/blob/main/packages/skill-lesson/utils/ability.ts#L72
    // so that this object doesn't have to be reshaped
    return {...product, modules: [product]}
  })
}

export const getProduct = async (productId: string) => {
  const product = await sanityClient.fetch(
    groq`*[_type == 'product' && productId == $productId][0] {
     "name": title,
     slug,
     "image": image.asset->{url, alt},
     state
    }`,
    {
      productId,
    },
  )
  return product
}
