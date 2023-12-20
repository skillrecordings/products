import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'
// import * as Sentry from '@sentry/nextjs'

export const ArticleSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.string(),
  state: z.enum(['published', 'draft']),
  author: z
    .object({
      name: z.string(),
      slug: z.string(),
      image: z.string(),
      imageAlt: z.string(),
    })
    .nullable()
    .optional(),
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
    await sanityClient.fetch(groq`*[_type == "article"] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        "slug": slug.current,
        description,
        body,
        image,
        ogImage,
        author-> {
          name,
          "slug": slug.current,
          "image": picture.asset->url,
          "imageAlt": picture.alt
        },
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
        body,
        image,
        ogImage,
        author-> {
          name,
          "slug": slug.current,
          "image": picture.asset->url,
          "imageAlt": picture.alt
        },
        resources[]->{
          ...
        }
    }`,
    {slug: `${slug}`},
  )

  const result = ArticleSchema.safeParse(article)

  if (result.success) {
    return result.data
  } else {
    // Sentry.captureMessage(`Unable to find Sanity Article with slug '${slug}'`)
    return null
  }
}
