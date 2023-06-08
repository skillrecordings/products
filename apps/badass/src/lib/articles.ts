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
  video: z
    .object({
      muxPlaybackId: z.string(),
      transcript: z.array(z.any()),
    })
    .optional()
    .nullable(),
  shareCardDetails: z.object({
    title: z.nullable(z.string()).optional(),
    subtitle: z.nullable(z.string()).optional(),
    image: z.nullable(z.string()).optional(),
  }),
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
    await sanityClient.fetch(groq`*[_type == "article" && state == 'published'] | order(_createdAt desc) {
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
        body,
        "shareCardDetails": {
          "title": shareCardDetails.title,
          "subtitle": shareCardDetails.subtitle,
          "image": shareCardDetails.image.url
        }
  }`)

  return ArticlesSchema.parse(articles)
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
        "video": resources[@->._type == 'videoResource'][0]-> {
          "transcript": castingwords.transcript,
          "muxPlaybackId": muxAsset.muxPlaybackId
        },
        state,
        description,
        "image": image.asset->url,
        summary,
        body,
        "shareCardDetails": {
          "title": shareCardDetails.title,
          "subtitle": shareCardDetails.subtitle,
          "image": shareCardDetails.image.url
        }
    }`,
    {slug: `${slug}`},
  )
  if (!article) {
    return undefined
  }
  return ArticleSchema.parse(article)
}
