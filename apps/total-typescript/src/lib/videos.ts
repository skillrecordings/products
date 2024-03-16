import z from 'zod'
import {sanityQuery} from '@/server/sanity.server'
import groq from 'groq'

const VideoResourceSchema = z.object({
  _id: z.string(),
  muxPlaybackId: z.string(),
})

export type VideoResource = z.infer<typeof VideoResourceSchema>

export async function getVideoResource(videoResourceId?: string) {
  if (!videoResourceId) {
    return null
  }
  const videoResource = await sanityQuery<VideoResource>(
    groq`*[_type == 'videoResource' && _id == "${videoResourceId}"][0]{
        _id,
        "muxPlaybackId": muxAsset.muxPlaybackId,
      }`,
    {tags: ['videoResource', videoResourceId]},
  )

  const parsed = VideoResourceSchema.safeParse(videoResource)

  if (!parsed.success) {
    console.error('Error parsing video', videoResourceId)
    console.error(parsed.error)
    return null
  } else {
    return parsed.data
  }
}
