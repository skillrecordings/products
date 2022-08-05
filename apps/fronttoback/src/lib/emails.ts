import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'

export async function getAllEmails() {
  return await sanityClient.fetch(groq`*[_type == "mail"] | order(date asc){
    _updatedAt,
    title,
    'slug': slug.current,
    description,
    body
}`)
}

export async function getEmail(slug: string) {
  return await sanityClient.fetch(
    groq`*[_type == "mail" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    body,
    description,
    image {
      src, alt, width
    }
    }`,
    {
      slug,
    },
  )
}
