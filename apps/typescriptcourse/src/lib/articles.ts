import groq from 'groq'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

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
