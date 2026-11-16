import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import * as mysql from 'mysql2/promise'
import getReadingTime from 'reading-time'
import {ContributorResource, ContributorResourcesSchema} from './contributors'

// Whole-minute reading estimate for an article body, or null when there's no
// body (matches how /articles and /[article] surface "~ N minutes").
const toReadingTime = (body?: string | null): number | null =>
  body ? Math.max(1, Math.round(getReadingTime(body).minutes)) : null

// Establish connection options for the course-builder database (same as articles)
const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

// Articles published from Course Builder live in the Course Builder MySQL DB,
// not in Sanity. Mirror lib/articles.ts (getAllArticles) and pull them in, keyed
// by the contributor's userId (which equals `createdById` on a Course Builder
// post). Without this, Course Builder articles render as standalone article
// pages but never appear on the author's contributor page.
//
// This lives in a `.server` module (not lib/contributors.ts) because
// lib/contributors.ts is imported by client components; importing mysql2 there
// would pull Node-only modules (`net`, `tls`) into the client bundle and break
// the build.
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
          readingTime: toReadingTime(fields.body),
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
            body,
            "slug": slug.current,
            "moduleType": moduleType,
            "image": coalesce(image.asset->url, image.secure_url),
            "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
    }`,
    {id},
  )

  // Compute reading time from the article body, then drop the body so it never
  // ships to the client (the schema parse below also strips it).
  const sanityResourcesWithReadingTime = (
    Array.isArray(sanityResources) ? sanityResources : []
  ).map((resource: any) => {
    const {body, ...rest} = resource
    return {
      ...rest,
      readingTime: resource._type === 'article' ? toReadingTime(body) : null,
    }
  })

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
  const merged = [...sanityResourcesWithReadingTime, ...courseBuilderResources]
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
