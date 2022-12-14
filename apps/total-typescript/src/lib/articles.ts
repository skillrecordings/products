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
  image: z.nullable(z.string()).optional(),
  description: z.nullable(z.string()).optional(),
  body: z.any().array().nullable().optional(),
  summary: z.any().array().nullable().optional(),
  state: z.enum(['published', 'draft']),
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
        "slug": slug.current,
        title,
        state,
        description,
        "image": image.asset->url,
        summary,
        body
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
        "slug": slug.current,
        title,
        state,
        description,
        "image": image.asset->url,
        summary,
        body
    }`,
    {slug: `${slug}`},
  )

  return ArticleSchema.parse(article)
}
