import {trpc} from '@/trpc/trpc.client'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import {useRouter} from 'next/router'
import z from 'zod'

export const ArticleSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  articleType: z
    .enum(['article', 'bookTeaser', 'announcement'])
    .nullable()
    .optional()
    .default('article'),
  title: z.string(),
  slug: z.string(),
  image: z.nullable(z.string()).optional(),
  description: z.nullable(z.string()).optional(),
  body: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  state: z.enum(['published', 'draft']),
  withEmailWall: z.boolean().nullish().default(false),
})

export const ArticlesSchema = z.array(ArticleSchema)

export type Article = z.infer<typeof ArticleSchema>

export const getPaginatedArticles = async (
  offset = 0,
  limit = 20,
): Promise<Article[]> => {
  const articles = await sanityClient.fetch(
    groq`*[_type == "article" && state == "published" ] | order(_createdAt desc) [${offset}...${limit}] {
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
  )

  const parsedArticles = ArticlesSchema.safeParse(articles)
  return parsedArticles.success ? parsedArticles.data : []
}

export const getAllArticles = async (): Promise<Article[]> => {
  const articles =
    await sanityClient.fetch(groq`*[_type == "article" && state == "published"] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        "slug": slug.current,
        articleType,
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

const validateLimit = (limit?: number) => {
  if (limit && limit > 0) {
    return limit
  } else {
    return undefined
  }
}

// Get a certain number of other articles that don't match the given slug
export const getOtherArticles = async (
  slug: string,
  options?: {limit?: number},
): Promise<Article[]> => {
  const limit = validateLimit(options?.limit)
  const querySlice = limit ? `[0...${limit}]` : ''

  const articles = await sanityClient.fetch(
    groq`*[_type == "article" && state == "published" && slug.current != $slug] | order(_createdAt desc) {
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
  }${querySlice}`,
    {slug},
  )

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
        articleType,
        title,
        state,
        description,
        "image": image.asset->url,
        withEmailWall,
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

export const usePaginatedArticles = (
  totalArticlesCount = 0,
  articlesPerPage = 5,
  initialArticles: Article[],
) => {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const offset = (page - 1) * articlesPerPage
  const limit = articlesPerPage * page
  const {data: paginatedArticles, status: paginatedArticlesStatus} =
    trpc.articles.getPaginatedArticles.useQuery(
      {
        offset: offset,
        limit: limit,
      },
      {
        enabled: page > 1,
      },
    )
  const articlesToRender = page > 1 ? paginatedArticles : initialArticles

  return {
    articlesToRender,
    paginatedArticlesStatus,
    pages: new Array(Math.ceil(totalArticlesCount / articlesPerPage)).fill(0),
    currentPage: page,
  }
}
