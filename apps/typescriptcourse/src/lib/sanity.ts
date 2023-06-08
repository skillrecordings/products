import {CastingWordsOrderResponseSchema} from 'lib/castingwords'
import {sanityWriteClient} from 'utils/sanity-server'
import {z} from 'zod'
import first from 'lodash/first'

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
