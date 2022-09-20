import {
  CastingwordsOrder,
  CastingWordsOrderResponseSchema,
  getSRTText,
  getTranscriptText,
} from 'lib/castingwords'
import {sanityWriteClient} from 'utils/sanity-server'
import {z} from 'zod'
import {uniqueId} from 'lodash'
import first from 'lodash/first'
import groq from 'groq'

const VideoResourceSchema = z.object({
  _id: z.string(),
  castingwords: z.object({
    audioFileId: z.string(),
    orderId: z.string(),
    transcript: z.any(),
    srt: z.string(),
  }),
})

type VideoResource = z.infer<typeof VideoResourceSchema>

export const writeTranscriptToVideoResource = async (
  audiofile: number,
  order: string,
) => {
  const transcript = await getTranscriptText(audiofile)
  const srt = await getSRTText(audiofile)

  const getDocumentQuery = groq`
      *[
        _type == "videoResource" &&
        castingwords.orderId == "${order}"
      ][0] {_id, castingwords}
    `

  const document: VideoResource = VideoResourceSchema.parse(
    await sanityWriteClient.fetch(getDocumentQuery),
  )

  const {_id, castingwords} = document

  return sanityWriteClient
    .patch(_id)
    .set({
      castingwords: {
        ...castingwords,
        transcript: [
          {
            style: 'normal',
            _type: 'block',
            // TODO: Programmatically create an array of blocks for each paragraph break in the transcript
            // how does this format in Portable Text?
            children: [
              {
                _type: 'span',
                marks: [],
                _key: uniqueId('body-key-'),
                text: transcript,
              },
            ],
            markDefs: [],
            _key: uniqueId('block-key-'),
          },
        ],
        srt: srt,
      },
    })
    .commit()
}

const UpdateVideoResourceAssetSchema = z.object({
  sanityDocumentId: z.string(),
  castingwordsOrder: CastingWordsOrderResponseSchema,
  muxAsset: z.object({
    muxAssetId: z.string(),
    muxPlaybackId: z.string().optional(),
  }),
})

type UpdateVideoResourceAsset = z.infer<typeof UpdateVideoResourceAssetSchema>

export const updateVideoResourceWithTranscriptOrderId = async ({
  sanityDocumentId,
  castingwordsOrder,
  muxAsset,
}: UpdateVideoResourceAsset) => {
  return sanityWriteClient
    .patch(sanityDocumentId)
    .set({
      muxAsset,
      castingwords: {
        orderId: castingwordsOrder.order,
        audioFileId: first(castingwordsOrder.audiofiles),
      },
    })
    .commit()
}
