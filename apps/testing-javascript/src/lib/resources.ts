import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'

const productsQuery = groq`*[_type == "product"] {
  productId,
  image {
    url
  },
  title,
  description,
  "modules": modules[]->{
    "id": _id,
    title,
    image {
      url
    },
    "description": body[0].children[0].text,
    "resources": {
      "id": _id,
      title,
      "slug": slug.current,
      "description": body[0].children[0].text,
      resources
    }
  }
}`

export const getActiveProducts = async () =>
  await sanityClient.fetch(productsQuery)
