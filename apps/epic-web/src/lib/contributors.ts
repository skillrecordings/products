import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import * as mysql from 'mysql2/promise'

const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

export const ContributorRoleSchema = z.enum([
  'author',
  'instructor',
  'host',
  'presenter',
  'editor',
  'reviewer',
  'illustrator',
])

export const ContributorSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  name: z.string(),
  slug: z.string(),
  userId: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  twitterHandle: z.string().optional().nullable(),
  links: z
    .array(
      z.object({
        label: z.string().optional().nullable(),
        url: z.string(),
      }),
    )
    .optional()
    .nullable(),
  picture: z
    .object({
      url: z.string(),
      alt: z.string(),
    })
    .optional()
    .nullable(),
})

export const ContributorsSchema = z.array(ContributorSchema)

export type Contributor = z.infer<typeof ContributorSchema>
export type ContributorRole = z.infer<typeof ContributorRoleSchema>

export const getAllContributors = async (): Promise<Contributor[]> => {
  const contributors =
    await sanityClient.fetch(groq`*[_type == "contributor"] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        name,
        bio,
        twitterHandle,
        links[]{
          url, label
        },
        picture->{
          "url": asset->url,
            alt
        },
        "slug": slug.current,
  }`)

  return ContributorsSchema.parse(contributors)
}

export const getContributor = async (
  slug: string,
): Promise<Contributor | null> => {
  const contributor = await sanityClient.fetch(
    groq`*[_type == "contributor" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        name,
        userId,
        bio,
        twitterHandle,
        links[]{
          url, label
        },
        picture {
            "url": asset->url,
            alt
        },
        "slug": slug.current,
    }`,
    {slug: `${slug}`},
  )

  const result = ContributorSchema.safeParse(contributor)

  if (result.success) {
    return result.data
  } else {
    // Sentry.captureMessage(`Unable to find Sanity Author with slug '${slug}'`)
    return null
  }
}

// ————————————————————————————————————————————————————————————————————————————————
// CONTRIBUTOR RESOURCES
// ————————————————————————————————————————————————————————————————————————————————

export const ContributorResourceSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  moduleType: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  muxPlaybackId: z.string().optional().nullable(),
})

export const ContributorResourcesSchema = z.array(ContributorResourceSchema)

export type ContributorResource = z.infer<typeof ContributorResourceSchema>

// Articles published from Course Builder live in the Course Builder MySQL DB,
// not in Sanity. Mirror lib/articles.ts (getAllArticles) and pull them in, keyed
// by the contributor's userId (which equals `createdById` on a Course Builder
// post). Without this, Course Builder articles render as standalone article
// pages but never appear on the author's contributor page.
const getContributorCourseBuilderArticles = async (
  userId: string,
): Promise<ContributorResource[]> => {
  const connection = await mysql.createConnection(access)

  try {
    const [rows] = await connection.execute(
      `SELECT * FROM zEW_ContentResource
       WHERE JSON_EXTRACT(fields, "$.postType") = 'article'
         AND JSON_EXTRACT(fields, "$.state") = 'published'
         AND createdById = ?`,
      [userId],
    )

    if (!Array.isArray(rows)) return []

    return Promise.all(
      (rows as any[]).map(async (row): Promise<ContributorResource> => {
        const fields =
          typeof row.fields === 'string'
            ? JSON.parse(row.fields)
            : row.fields || {}

        // Find the article's video (if any) for the contributor-page thumbnail.
        let muxPlaybackId: string | null = null
        try {
          const [videoRows] = await connection.execute(
            `SELECT resource.fields
             FROM zEW_ContentResourceResource crr
             JOIN zEW_ContentResource resource ON crr.resourceId = resource.id
             WHERE crr.resourceOfId = ?
               AND resource.type = 'videoResource'
               AND crr.deletedAt IS NULL
               AND resource.deletedAt IS NULL
             LIMIT 1`,
            [row.id],
          )

          if (Array.isArray(videoRows) && videoRows.length > 0) {
            const videoFields =
              typeof (videoRows[0] as any).fields === 'string'
                ? JSON.parse((videoRows[0] as any).fields)
                : (videoRows[0] as any).fields || {}
            muxPlaybackId = videoFields.muxPlaybackId || null
          }
        } catch (error) {
          console.error(
            '[getContributorResources] Error fetching video for article:',
            error,
          )
        }

        return {
          _id: row.id,
          _type: 'article',
          _updatedAt: row.updatedAt
            ? new Date(row.updatedAt).toISOString()
            : '',
          _createdAt: row.createdAt
            ? new Date(row.createdAt).toISOString()
            : '',
          title: fields.title || '',
          slug: fields.slug || '',
          description: fields.description || null,
          moduleType: null,
          image: null,
          muxPlaybackId,
        }
      }),
    )
  } finally {
    await connection.end()
  }
}

export const getContributorResources = async (
  id: string,
  userId?: string | null,
): Promise<ContributorResource[] | null> => {
  const sanityResources = await sanityClient.fetch(
    groq`*[$id in contributors[].contributor._ref && _type in ["article", "tip", "module", "talk"] && state == 'published'] | order(_createdAt desc) {
            _id,
            _type,
            _updatedAt,
            _createdAt,
            title,
            description,
            summary,
            "slug": slug.current,
            "moduleType": moduleType,
            "image": coalesce(image.asset->url, image.secure_url),
            "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
    }`,
    {id},
  )

  let courseBuilderResources: ContributorResource[] = []
  if (userId) {
    try {
      courseBuilderResources = await getContributorCourseBuilderArticles(userId)
    } catch (error) {
      console.error(
        '[getContributorResources] Error fetching Course Builder articles:',
        error,
      )
    }
  }

  // Merge both sources, drop duplicate slugs (an article may exist in both
  // after a migration), and keep the newest-to-oldest ordering of the page.
  const seen = new Set<string>()
  const merged = [
    ...(Array.isArray(sanityResources) ? sanityResources : []),
    ...courseBuilderResources,
  ]
    .filter((resource: any) => {
      const slug = resource?.slug
      if (!slug) return true
      if (seen.has(slug)) return false
      seen.add(slug)
      return true
    })
    .sort(
      (a: any, b: any) =>
        new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime(),
    )

  const result = ContributorResourcesSchema.safeParse(merged)

  if (result.success) {
    return result.data
  } else {
    return null
  }
}
