import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'

export async function getAllReviews() {
  return await sanityClient.fetch(groq`*[_type == "review"] | order(_createdAt desc){
    title,
    description,
    _createdAt,
    'slug': slug.current,
    published,
    image,
    date
}`)
}
