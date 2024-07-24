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
  "instructors": array::unique(modules[]->.contributors[@.role == 'instructor'].contributor->{ 
    _id,
    name,
    "slug": slug.current,
    image
  }),
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
  "slug": slug.current,
  productId,
  description,
  state,
  type,
  title,
  body,
  _createdAt,
  action,
  "welcomeVideo": welcomeVideo->{"muxPlaybackId":muxAsset.muxPlaybackId, poster},
  image {
    url,
    alt
  },
  ogImage,
  "instructors": array::unique(modules[]->.contributors[@.role == 'instructor'].contributor->{ 
    _id,
    name,
    "slug": slug.current,
    image
  }),
  modules[]->{
    "slug": slug.current,
    "instructors": contributors[@.role == 'instructor'].contributor->{
              ...,
              "slug": slug.current,
          },
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
     "slug": slug.current,
     type,
     action,
     image {
      url
     },
  "instructors": array::unique(modules[]->.contributors[@.role == 'instructor'].contributor->{ 
    _id,
    name,
    "slug": slug.current,
    picture
  }),
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
