import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {ContributorSchema} from './contributors'
import * as mysql from 'mysql2/promise'
// import * as Sentry from '@sentry/nextjs'

const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

export const ArticlePostSchema = z.object({
  id: z.string().nullish(),
  organizationId: z.string().nullish(),
  createdByOrganizationMembershipId: z.string().nullish(),
  type: z.literal('post').nullish(),
  createdById: z.string().nullish(),
  fields: z.object({
    body: z.string().nullish(),
    slug: z.string().nullish(),
    state: z.enum(['draft', 'published']).nullish(),
    title: z.string().nullish(),
    github: z.string().nullish(),
    postType: z.literal('article').nullish(),
    visibility: z.literal('public').nullish(),
    description: z.string().nullish(),
    thumbnailTime: z.number().nullish(),
  }),
  currentVersionId: z.string().nullish(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export type ArticlePost = z.infer<typeof ArticlePostSchema>

export const ArticlePostsSchema = z.array(ArticlePostSchema)

export type ArticlePosts = z.infer<typeof ArticlePostsSchema>

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
  author: ContributorSchema.optional().nullable(),
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
  const connection = await mysql.createConnection(access)

  const [rows] = await connection.execute(
    'SELECT * FROM zEW_ContentResource WHERE JSON_EXTRACT(fields, "$.postType") = ?',
    ['article'],
  )

  const articlePosts = ArticlePostsSchema.parse(rows)

  const data =
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
        "author": contributors[@.role == 'author'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
        },
        resources[]->{
          ...
        }
  }`)

  console.log('DATA---', data[0])

  const articleDocuments = ArticlesSchema.parse(data)

  // Transform articlePosts to match ArticleSchema format
  const transformedArticlePosts = articlePosts.map((post) => ({
    _id: post.id || '',
    _type: 'article',
    _updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : '',
    _createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : '',
    title: post.fields.title || '',
    slug: post.fields.slug || '',
    description: post.fields.description || null,
    body: post.fields.body || '',
    state: post.fields.state || 'draft',
    author: null,
    image: null,
    ogImage: null,
    resources: [],
  }))

  // Merge and sort by createdAt
  const allArticles = ArticlesSchema.parse(
    [...articleDocuments, ...transformedArticlePosts].sort(
      (a, b) =>
        new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime(),
    ),
  )

  return allArticles
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
        "author": contributors[@.role == 'author'][0].contributor->{
          _id,
          _type,
          _updatedAt,
          _createdAt,
          name,
          bio,
          links[] {
            url, label
          },
          picture {
              "url": asset->url,
              alt
          },
          "slug": slug.current,
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
