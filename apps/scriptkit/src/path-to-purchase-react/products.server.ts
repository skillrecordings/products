import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

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
    moduleType,
    "slug": slug.current,
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

export const getProductBySlug = async (productSlug: string) => {
  const product = await sanityClient.fetch(
    groq`*[_type == 'product' && slug.current == $productSlug][0] {
"name": title,
  productId,
  description,
  action,
  image {
    url,
    alt
  },
  modules[]->{
    moduleType,
    title,
    "image": image.asset->{url, alt},
    state
  },
  features[]{
    value
  }
    }`,
    {
      productSlug,
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
     },
     modules[]->{
      moduleType,
      slug
     }
    }`,
    {
      productId,
    },
  )
  return product
}
