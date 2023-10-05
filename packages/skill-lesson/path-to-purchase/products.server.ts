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
  state,
  title,
  body,
  _createdAt,
  action,
  image {
    url,
    alt
  },
  modules[]->{
    "slug": slug.current,
    moduleType,
    title,
    "image": image.asset->{url, alt},
    state,
    "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson', 'interview']]->{"slug": slug.current,...},
    "sections": resources[@->._type == 'section']->{
    _id,
    _type,
    _updatedAt,
    title,
    description,
    "slug": slug.current,
    "lessons": resources[@->._type in ['exercise', 'explainer', 'lesson', 'interview']]->{
      _id,
      _type,
      _updatedAt,
      "slug": slug.current,
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
