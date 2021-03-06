import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'

export async function getAllArticles() {
  return await sanityClient.fetch(groq`*[_type == "article" && published == true] | order(date asc){
    _updatedAt,
    title,
    subtitle,
    'slug': slug.current,
    description,
    body,
    published,
    image,
    date,
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
}`)
}

export async function getArticle(slug: string) {
  return await sanityClient.fetch(
    groq`*[_type == "article" && slug.current == $slug][0]{
    title,
    subtitle,
    "slug": slug.current,
    body,
    date,
    description,
    related[]->{
      title,
      subtitle,
      'slug': slug.current
    },
    ogImage{
      url
    },
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
    }`,
    {
      slug,
    },
  )
}
