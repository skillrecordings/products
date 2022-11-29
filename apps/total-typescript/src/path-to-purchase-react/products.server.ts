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
