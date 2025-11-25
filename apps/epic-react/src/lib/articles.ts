import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {prisma} from '@skillrecordings/database'
const PostSchema = z.object({
  id: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  resourceOf: z.any().array().nullable().optional(),
  fields: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    summary: z.string().optional(),
    body: z.string().optional().default(''),
    state: z.string(),
    visibility: z.string(),
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
  }),
})

export const ArticleSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.coerce.string(),
  _createdAt: z.coerce.string(),
  title: z.string(),
  slug: z.string(),
  date: z.string().datetime().nullable().optional(),
  description: z.nullable(z.string()).optional(),
  summary: z.nullable(z.string()).optional().default(null),
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
    .nullable()
    .default(null),
  ogImage: z
    .object({
      secure_url: z.string(),
    })
    .partial()
    .optional()
    .nullable()
    .default(null),
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

  const posts = await prisma.contentResource
    .findMany({
      where: {
        type: 'post',
        fields: {
          path: '$.state',
          string_contains: 'published',
        },
      },
      include: {
        resourceOf: {
          include: {
            resource: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    .then((posts) => {
      if (!posts) {
        return []
      }
      return z.array(PostSchema).parse(posts).map(convertPostToArticle)
    })

  return ArticlesSchema.parse(
    [...articles, ...posts].sort((a, b) => b.date - a.date),
  )
}

function convertPostToArticle(post: any) {
  if (!post) {
    return null
  }

  const parsedArticle = ArticleSchema.safeParse({
    _id: post?.id,
    _type: 'article',
    _updatedAt: post?.updatedAt,
    _createdAt: post?.createdAt,
    date: post?.updatedAt.toISOString(),
    title: post?.fields.title,
    state: post?.fields.state === 'published' ? 'published' : 'draft',
    slug: post?.fields.slug,
    description: post?.fields.description,
    summary: post?.fields.summary || post?.fields.description,
    body: post?.fields.body,
    image: post?.fields.image,
    ogImage: post?.fields.ogImage,
    resources:
      post?.resourceOf?.map((r: any) => ({
        ...r.resource,
        createdAt:
          r.resource.createdAt?.toISOString?.() ?? r.resource.createdAt,
        updatedAt:
          r.resource.updatedAt?.toISOString?.() ?? r.resource.updatedAt,
        deletedAt:
          r.resource.deletedAt?.toISOString?.() ?? r.resource.deletedAt,
      })) ?? [],
  })

  if (parsedArticle.success) {
    return parsedArticle.data
  } else {
    console.error('Error parsing post to article', parsedArticle.error)
    return null
  }
}

async function getPostAsArticle(slug: string) {
  const id = slug.split('~').pop() || slug

  const rawPost = await prisma.contentResource.findFirst({
    where: {
      fields: {
        path: '$.slug',
        string_contains: id,
      },
    },
    include: {
      resourceOf: {
        include: {
          resource: {
            include: {
              resourceOf: {
                include: {
                  resource: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const parsedPost = PostSchema.nullable().safeParse(rawPost)

  if (parsedPost.success) {
    const post = parsedPost.data
    const article = convertPostToArticle(post)
    if (article) {
      return article
    } else {
      return null
    }
  }

  console.error('Error parsing post', parsedPost.error)
  return null
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
    return await getPostAsArticle(slug)
  }

  return ArticleSchema.parse(article)
}
