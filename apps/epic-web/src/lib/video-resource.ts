import {z} from 'zod'

const muxAssetSchema = z.object({
  muxPlaybackId: z.string(),
  muxAssetId: z.string(),
  _type: z.string(),
})

const transcriptSchema = z.object({
  srt: z.string(),
  text: z.string(),
})

const castingwordsSchema = z.object({
  transcript: z.string(),
})

const videoResourceSchema = z.object({
  muxAsset: muxAssetSchema,
  _updatedAt: z.string(),
  transcript: transcriptSchema,
  _createdAt: z.string(),
  _rev: z.string(),
  title: z.string(),
  originalMediaUrl: z.string(),
  castingwords: castingwordsSchema,
  _type: z.string(),
  _id: z.string(),
})

export type VideoResource = z.infer<typeof videoResourceSchema>
