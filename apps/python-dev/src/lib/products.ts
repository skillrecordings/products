import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

const productsQuery = groq`*[_type == "pricing"][0] {
  title,
  subtitle,
  "products": products[]->{
  "name": title,
  productId,
  action,
  image {
    url,
    alt
  },
  modules[]->{
    title,
    image {
      url,
      alt
    }
  },
  features[]{
    value
  }
  }
}`

export const getActiveProducts = async () =>
  await sanityClient.fetch(productsQuery)
