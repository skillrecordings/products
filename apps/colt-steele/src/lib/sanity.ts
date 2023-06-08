import {
  CastingWordsOrderResponseSchema,
  getSRTText,
  getTranscriptText,
} from 'lib/castingwords'
import {sanityWriteClient} from 'utils/sanity-server'
import {z} from 'zod'
import {uniqueId} from 'lodash'
import first from 'lodash/first'
import groq from 'groq'
import Mux from '@mux/mux-node'

const VideoResourceSchema = z.object({
  _id: z.string(),
  originalMediaUrl: z.string(),
  castingwords: z
    .object({
      audioFileId: z.string().or(z.number()).optional(),
      orderId: z.string(),
      transcript: z.any().optional(),
      srt: z.string().optional(),
    })
    .nullish(),
  muxAsset: z
    .object({
      muxAssetId: z.string(),
      muxPlaybackId: z.string().optional(),
    })
    .nullish(),
  duration: z.number().optional(),
})

const UpdateVideoResourceAssetSchema = z.object({
  sanityDocumentId: z.string(),
  castingwordsOrder: CastingWordsOrderResponseSchema,
  muxAsset: z.object({
    muxAssetId: z.string(),
    muxPlaybackId: z.string().optional(),
  }),
  duration: z.number().optional(),
})

type UpdateVideoResourceAsset = z.infer<typeof UpdateVideoResourceAssetSchema>

export const updateVideoResourceWithTranscriptOrderId = async ({
  sanityDocumentId,
  castingwordsOrder,
  muxAsset,
  duration,
}: UpdateVideoResourceAsset) => {
  console.info('update Sanity document:', sanityDocumentId)
  return sanityWriteClient
    .patch(sanityDocumentId)
    .set({
      duration,
      muxAsset,
      castingwords: {
        orderId: castingwordsOrder.order,
        audioFileId: String(first(castingwordsOrder.audiofiles)),
      },
    })
    .commit()
}
