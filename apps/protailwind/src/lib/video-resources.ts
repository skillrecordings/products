import groq from 'groq'
import {
  VideoResource,
  VideoResourceSchema,
} from '@skillrecordings/skill-lesson/schemas/video-resource'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

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
