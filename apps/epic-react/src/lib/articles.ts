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
  date: z.string().optional().nullable(),
  description: z.nullable(z.string()).optional(),
  summary: z.nullable(z.string()).optional(),
  body: z.string(),
  state: z.enum(['published', 'draft']),
  image: z
    .object({
      width: z.number(),
      height: z.number(),
      secure_url: z.string(),
    })
    .partial()
    .optional()
    .nullable(),
  ogImage: z
    .object({
      secure_url: z.string(),
    })
    .partial()
    .optional()
    .nullable(),
  resources: z.any().array().nullable(),
})

export const ArticlesSchema = z.array(ArticleSchema)

export type Article = z.infer<typeof ArticleSchema>

export const getAllArticles = async (): Promise<Article[]> => {
  const articles =
    await sanityClient.fetch(groq`*[_type == "article" && state == 'published'] | order(date desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        date,
        "slug": slug.current,
        description,
        summary,
        body,
        image,
        ogImage,
        resources[]->{
          ...
        }
  }`)

  return ArticlesSchema.parse(articles)
}

export const getArticle = async (slug: string): Promise<Article | null> => {
  const article = await sanityClient.fetch(
    groq`*[_type == "article" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        "slug": slug.current,
        description,
        summary,
        body,
        image,
        ogImage,
        resources[]->{
          ...
        }
    }`,
    {slug: `${slug}`},
  )

  if (!article) {
    return null
  }

  return ArticleSchema.parse(article)
}
