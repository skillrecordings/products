import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'

export const getPricing = async () => {
  const pricing = await sanityClient.fetch(
    groq`*[_type == 'pricing'][]{
    _id,
    title,
    subtitle,
    "products": products[]->{
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
    }
    }`,
  )
  return pricing
}
