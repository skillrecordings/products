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
  author: z.string(),
  authorAvatar: z.string(),
  video: z
    .object({
      muxPlaybackId: z.string(),
      transcript: z.array(z.any()),
    })
    .optional()
    .nullable(),
  description: z.nullable(z.string()).optional(),
  state: z.enum(['published', 'draft']),
  card_color: z.enum(['red', 'green']),
  // TODO: clean up the types
  markdownBody: z.string().nullable(),
  articleHeaderImage: z.string().nullable().optional(),
  shareCardImage: z.string().nullable().optional(),
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
        "slug": slug.current,
        title,
        state,
        author,
        "authorAvatar": authorAvatar.url,
        description,
        card_color,
        markdownBody,
        "articleHeaderImage": articleHeaderImage.url,
        "shareCardImage": shareCardImage.url
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
        author,
        "authorAvatar": authorAvatar.url,
        "video": resources[@->._type == 'videoResource'][0]-> {
          "transcript": castingwords.transcript,
          "muxPlaybackId": muxAsset.muxPlaybackId
        },
        state,
        description,
        card_color,
        markdownBody,
        "articleHeaderImage": articleHeaderImage.url,
        "shareCardImage": shareCardImage.url
    }`,
    {slug: `${slug}`},
  )
  if (!article) {
    return undefined
  }
  return ArticleSchema.parse(article)
}
