import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'

export async function getAllReviews() {
  return await sanityClient.fetch(groq`*[_type == "review"] | order(order asc){
    title,
    description,
    'slug': slug.current,
    hlsUrl,
    published,
    image,
    date,
    order
}`)
}
