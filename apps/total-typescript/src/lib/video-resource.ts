import {sanityClient} from '../utils/sanity-client'
import groq from 'groq'
import z from 'zod'

export const VideoResourceSchema = z.object({
  _id: z.string().optional(),
  muxPlaybackId: z.string().optional(),
  transcript: z.nullable(z.any().array()).optional(),
})

export type VideoResource = z.infer<typeof VideoResourceSchema>

export const getVideoResource = async (id: string): Promise<VideoResource> => {
  const videoResource = await sanityClient.fetch(
    groq`*[_type in ['videoResource'] && _id == $id][0]{
      _id,
      "transcript": castingwords.transcript,
      "muxPlaybackId": muxAsset.muxPlaybackId
    }`,
    {id},
  )

  return VideoResourceSchema.parse(videoResource)
}
