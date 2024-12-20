import z from 'zod'

export const VideoResourceSchema = z.object({
  _id: z.string().optional(),
  muxPlaybackId: z.string().optional(),
  transcript: z.nullable(z.any().array().or(z.string())).optional(),
  poster: z.string().optional().nullable(),
  duration: z.number().optional().nullable(),
})

export type VideoResource = z.infer<typeof VideoResourceSchema>
