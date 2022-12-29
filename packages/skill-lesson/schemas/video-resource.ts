import z from 'zod'

export const VideoResourceSchema = z.object({
  _id: z.string().optional(),
  muxPlaybackId: z.string().optional(),
  transcript: z.nullable(z.any().array()).optional(),
})

export type VideoResource = z.infer<typeof VideoResourceSchema>
