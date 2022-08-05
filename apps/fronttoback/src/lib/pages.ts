import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'

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
