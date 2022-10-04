import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'

export async function getAllPages() {
  return await sanityClient.fetch(groq`*[_type == "page"] | order(date asc){
    _updatedAt,
    title,
    'slug': slug.current,
    description,
    body
}`)
}

export async function getPage(slug: string) {
  return await sanityClient.fetch(
    groq`*[_type == "page" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    body,
    description
    }`,
    {
      slug,
    },
  )
}
