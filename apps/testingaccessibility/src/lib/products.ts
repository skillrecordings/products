import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'

const productsQuery = groq`*[_type == "product"] | order(order asc) {
  "name": title,
  productId,
  action,
  order,
  image {
    url,
    alt
  },
  modules[]->{
    title
  },
  features[]{
    value
  }
  }`

export const getActiveProducts = async () =>
  await sanityClient.fetch(productsQuery).then((data) => data.products)
