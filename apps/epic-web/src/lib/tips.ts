import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'
import z from 'zod'
import {pickBy} from 'lodash'
import * as mysql from 'mysql2/promise'
import {ContributorSchema} from './contributors'

// Establish connection options for the course-builder database (same as articles)
const access: mysql.ConnectionOptions = {
  uri: process.env.COURSE_BUILDER_DATABASE_URL,
}

// ----------------------------------
// Tip Post (Course-builder) Schemas
// ----------------------------------

export const TipPostSchema = z.object({
  id: z.string().nullish(),
  organizationId: z.string().nullish(),
  createdByOrganizationMembershipId: z.string().nullish(),
  type: z.literal('post').nullish(),
  createdById: z.string().nullish(),
  fields: z.object({
    body: z.string().nullish(),
    summary: z.string().nullish(),
    slug: z.string().nullish(),
    // Tip posts coming from the course-builder can be in many states; we coerce them later
    state: z
      .union([
        z.literal('new'),
        z.literal('processing'),
        z.literal('reviewing'),
        z.literal('published'),
        z.literal('retired'),
        z.literal('draft'),
        z.literal(''),
      ])
      .nullish(),
    title: z.string().nullish(),
    github: z.string().nullish(),
    postType: z.literal('tip').nullish(),
    visibility: z.literal('public').nullish(),
    description: z.string().nullish(),
  }),
  currentVersionId: z.string().nullish(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
})

export type TipPost = z.infer<typeof TipPostSchema>

export const TipPostsSchema = z.array(TipPostSchema)

export const TipSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  _createdAt: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  muxPlaybackId: z.nullable(z.string()).optional(),
  state: z.enum(['new', 'processing', 'reviewing', 'published', 'retired']),
  videoPosterUrl: z.nullable(z.string()).optional(),
  sandpack: z
    .array(
      z.object({
        file: z.string(),
        code: z.string(),
        active: z.boolean(),
      }),
    )
    .optional()
    .nullable(),
  videoResourceId: z.nullable(z.string()).optional(),
  transcript: z.nullable(z.string()).optional(),
  tweetId: z.nullable(z.string()).optional(),
  instructor: ContributorSchema.optional().nullable(),
})

export const TipsSchema = z.array(TipSchema)

export type Tip = z.infer<typeof TipSchema>

// Transform a course-builder Tip post into our public Tip shape
const allowedTipStates = [
  'new',
  'processing',
  'reviewing',
  'published',
  'retired',
] as const

const transformTipPost = (
  post: TipPost & {videoFields?: any; videoResourceId?: string | null},
): Tip => {
  const rawState = post.fields.state || 'published'
  const state = (
    allowedTipStates.includes(rawState as any) ? rawState : 'published'
  ) as (typeof allowedTipStates)[number]

  const videoFields = post.videoFields || null

  return {
    _id: post.id || '',
    _type: 'tip',
    _updatedAt: post.updatedAt ? new Date(post.updatedAt).toISOString() : '',
    _createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : '',
    title: post.fields.title || '',
    slug: post.fields.slug || '',
    description: post.fields.description || null,
    body: post.fields.body || null,
    summary: post.fields.summary || null,
    muxPlaybackId: videoFields?.muxPlaybackId || null,
    videoPosterUrl: null,
    sandpack: null,
    videoResourceId: post.videoResourceId || null,
    transcript: null,
    tweetId: null,
    instructor: null,
    state,
  }
}

export const getAllTips = async (onlyPublished = true): Promise<Tip[]> => {
  // --------------------------
  // 1. Fetch tips from database
  // --------------------------
  const connection = await mysql.createConnection(access)

  const [rows] = await connection.execute(
    `
    SELECT
      tip.*,
      (
        SELECT
          resource.id
        FROM
          zEW_ContentResourceResource crr
        JOIN
          zEW_ContentResource resource ON crr.resourceId = resource.id
        WHERE
          crr.resourceOfId = tip.id AND JSON_EXTRACT(resource.fields, '$.muxPlaybackId') IS NOT NULL
        LIMIT 1
      ) AS videoResourceId,
      (
        SELECT
          resource.fields
        FROM
          zEW_ContentResourceResource crr
        JOIN
          zEW_ContentResource resource ON crr.resourceId = resource.id
        WHERE
          crr.resourceOfId = tip.id AND JSON_EXTRACT(resource.fields, '$.muxPlaybackId') IS NOT NULL
        LIMIT 1
      ) AS videoFields
    FROM
      zEW_ContentResource tip
    WHERE
      JSON_EXTRACT(tip.fields, "$.postType") = 'tip'
  `,
  )

  const tipPosts = z.array(TipPostSchema.passthrough()).parse(rows)
  const transformedTipPosts = tipPosts.map(transformTipPost)

  // Close the connection as soon as we're done
  await connection.end()

  // -------------------------
  // 2. Fetch tips from Sanity
  // -------------------------
  const sanityTipsRaw = await sanityClient.fetch(groq`*[_type == "tip" ${
    onlyPublished ? `&& state == "published"` : ''
  }] | order(_createdAt desc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        description,
        summary,
        body,
        "instructor": contributors[@.role == 'instructor'][0].contributor->{
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
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId
  }`)

  const sanityTips = TipsSchema.parse(sanityTipsRaw)

  // -------------------------
  // 3. Merge and sort results
  // -------------------------
  let allTips: Tip[] = [...sanityTips, ...transformedTipPosts]

  if (onlyPublished) {
    allTips = allTips.filter((tip) => tip.state === 'published')
  }

  allTips.sort(
    (a, b) =>
      new Date(b._createdAt || '').getTime() -
      new Date(a._createdAt || '').getTime(),
  )

  return TipsSchema.parse(allTips)
}

export const getTip = async (slug: string): Promise<Tip> => {
  // --------------------------
  // 1. Try to fetch from DB
  // --------------------------
  const connection = await mysql.createConnection(access)

  const [rows] = await connection.execute(
    `
    SELECT
      tip.*,
      (
        SELECT
          resource.id
        FROM
          zEW_ContentResourceResource crr
        JOIN
          zEW_ContentResource resource ON crr.resourceId = resource.id
        WHERE
          crr.resourceOfId = tip.id AND JSON_EXTRACT(resource.fields, '$.muxPlaybackId') IS NOT NULL
        LIMIT 1
      ) AS videoResourceId,
      (
        SELECT
          resource.fields
        FROM
          zEW_ContentResourceResource crr
        JOIN
          zEW_ContentResource resource ON crr.resourceId = resource.id
        WHERE
          crr.resourceOfId = tip.id AND JSON_EXTRACT(resource.fields, '$.muxPlaybackId') IS NOT NULL
        LIMIT 1
      ) AS videoFields
    FROM
      zEW_ContentResource tip
    WHERE
      JSON_EXTRACT(tip.fields, "$.postType") = 'tip' AND JSON_EXTRACT(tip.fields, "$.slug") = ?
  `,
    [slug],
  )

  const tipPostsParsed = z.array(TipPostSchema.passthrough()).safeParse(rows)

  if (tipPostsParsed.success && tipPostsParsed.data.length > 0) {
    await connection.end()
    return transformTipPost(tipPostsParsed.data[0])
  }

  await connection.end()

  // --------------------------
  // 2. Fallback to Sanity
  // --------------------------
  const tip = await sanityClient.fetch(
    groq`*[_type == "tip" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        description,
        summary,
        body,
        "instructor": contributors[@.role == 'instructor'][0].contributor->{
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
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "videoPosterUrl": resources[@->._type == 'videoResource'][0]->poster,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "legacyTranscript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "transcript": resources[@->._type == 'videoResource'][0]-> transcript.text,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId
    }`,
    {slug},
  )

  if (tip && tip.legacyTranscript && !tip.transcript) {
    tip.transcript = tip.legacyTranscript
  }

  return TipSchema.parse(pickBy(tip))
}
