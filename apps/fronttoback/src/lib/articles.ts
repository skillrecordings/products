import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'

export async function getAllArticles() {
  return await sanityClient.fetch(groq`*[_type == "article"] | order(title asc){
    _updatedAt,
    title,
    'slug': slug.current,
    description,
    date,
    body
}`)
}

export async function getArticle(slug: string) {
  return await sanityClient.fetch(
    groq`*[_type == "article" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    body,
    date,
    description,
    }`,
    {
      slug,
    },
  )
}
