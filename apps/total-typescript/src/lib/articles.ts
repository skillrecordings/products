import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
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
  body: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  state: z.enum(['published', 'draft']),
})

export const ArticlesSchema = z.array(ArticleSchema)

export type Article = z.infer<typeof ArticleSchema>

export const getAllArticles = async (): Promise<Article[]> => {
  const articles =
    await sanityClient.fetch(groq`*[_type == "article" && state == "published"] | order(_createdAt desc) {
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

  const parsedArticles = ArticlesSchema.safeParse(articles)
  return parsedArticles.success ? parsedArticles.data : []
}

export const getArticle = async (
  slug: string,
): Promise<Article | undefined> => {
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
  if (!article) {
    return undefined
  }

  const parsedArticle = ArticleSchema.safeParse(article)
  return parsedArticle.success ? parsedArticle.data : undefined
}
