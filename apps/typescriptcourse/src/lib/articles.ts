import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'

export async function getAllArticles() {
  return await sanityClient.fetch(groq`*[_type == "article"] | order(date asc){
    title,
    'slug': slug.current,
    description,
    body,
    published,
    image,
    date
}`)
}
