import z from 'zod'
import {ContributorSchema} from './contributors'

// ----------------------------------
// Tip Schemas and Types (client-safe)
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

// ----------------------------------
// Helpers
// ----------------------------------

const allowedTipStates = [
  'new',
  'processing',
  'reviewing',
  'published',
  'retired',
] as const

export const transformTipPost = (
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

export {allowedTipStates}
