import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'

export async function getAllArticles() {
  try {
    return await sanityClient.fetch(groq`*[_type == "article"] | order(date desc){
    title,
    'slug': slug.current,
    description,
    preview,
    body,
    published,
    image,
    date
}`)
  } catch (e) {
    console.error()
    return []
  }
}
