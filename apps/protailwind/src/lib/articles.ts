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
    date
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
    ...
    },
    ogImage{
      url
    },
    "numberOfCharacters": length(pt::text(body)),
    // assumes 5 characters as mean word length
    // https://ux.stackexchange.com/questions/22520/how-long-does-it-take-to-read-x-number-of-characters
    "estimatedWordCount": round(length(pt::text(body)) / 5),
    // Words per minute: 180
    "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
    }`,
    {
      slug,
    },
  )
}
