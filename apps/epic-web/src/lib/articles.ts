import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const ArticleSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.any().array(),
  image: z
    .object({
      width: z.number(),
      height: z.number(),
      secure_url: z.string(),
    })
    .partial()
    .optional()
    .nullable(),
  resources: z.any().array().nullable(),
  estimatedReadingTime: z.number(),
})

export const ArticlesSchema = z.array(ArticleSchema)

export type Article = z.infer<typeof ArticleSchema>

export const getAllArticles = async (): Promise<Article[]> => {
  const articles =
    await sanityClient.fetch(groq`*[_type == "article"] | order(_createdAt asc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        "slug": slug.current,
        description,
        body,
        image,
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
        resources[]->{
          ...
        }
  }`)

  return ArticlesSchema.parse(articles)
}

export const getArticle = async (slug: string): Promise<Article> => {
  const article = await sanityClient.fetch(
    groq`*[_type == "article" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        "slug": slug.current,
        description,
        body,
        image,
        "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 ),
        resources[]->{
          ...
        }
    }`,
    {slug: `${slug}`},
  )

  return ArticleSchema.parse(article)
}

// import {sanityClient} from '../utils/sanity-client'
// import groq from 'groq'

// export async function getAllArticles() {
//   try {
//     return await sanityClient.fetch(groq`*[_type == "article"] | order(date desc){
//     title,
//     'slug': slug.current,
//     description,
//     preview,
//     body,
//     published,
//     image,
//     date
// }`)
//   } catch (e) {
//     console.error()
//     return []
//   }
// }
