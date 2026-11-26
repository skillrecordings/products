import {sanityWriteClient} from '../utils/sanity-server'
import {NextApiRequest, NextApiResponse} from 'next'
import {createMuxAsset} from './mux'
import {redactPresignedUrls} from './upload-media-url'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'

/**
 * Records the Mux asset on a new video resource. Transcripts no longer come
 * from CastingWords (retired: its webhook had crashed on load since at least
 * February 2026 and nothing ordered from it), so nothing here orders one.
 */
export const updateVideoResourceWithMuxAsset = async ({
  sanityDocumentId,
  muxAsset,
  duration,
}: {
  sanityDocumentId: string
  muxAsset: {muxAssetId: string; muxPlaybackId?: string}
  duration?: number
}) => {
  return sanityWriteClient
    .patch(sanityDocumentId)
    .set({duration, muxAsset})
    .commit()
}

const secret = process.env.SANITY_WEBHOOK_SECRET as string

/**
 * link to webhook {@link} https://www.sanity.io/organizations/om9qNpcXE/project/z9io1e0u/api/webhooks/xV5ZY6656qclI76i
 *
 * A video resource that already has a Mux asset is left alone, so a replayed
 * or late delivery for an old document writes nothing and creates nothing. The
 * check reads the stored document: a resend carries the original creation
 * body, which never has a Mux asset.
 *
 * @param req
 * @param res
 */
export const sanityVideoResourceWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string
  const isValid = await isValidSignature(
    JSON.stringify(req.body),
    signature,
    secret,
  )

  try {
    if (isValid) {
      const {_id, originalMediaUrl, muxAsset, duration} = req.body
      const stored = await sanityWriteClient.fetch(
        `*[_id == $id][0]{muxAsset}`,
        {id: _id},
      )
      if (muxAsset?.muxAssetId || stored?.muxAsset?.muxAssetId) {
        res.status(200).json({success: true, skipped: 'mux asset exists'})
        return
      }
      console.info('processing Sanity webhook: Video Resource created', _id)

      const {duration: assetDuration, ...newMuxAsset} = await createMuxAsset({
        originalMediaUrl,
        muxAsset,
        duration,
      })

      await updateVideoResourceWithMuxAsset({
        sanityDocumentId: _id,
        muxAsset: newMuxAsset,
        duration: assetDuration,
      })
      res.status(200).json({success: true})
    } else {
      res.status(500).json({success: false})
    }
  } catch (e) {
    // Still 200 so Sanity doesn't retry into a half-made asset, but say why.
    console.error(
      'Sanity video resource webhook failed',
      redactPresignedUrls(e instanceof Error ? e.message : String(e)),
    )
    res.status(200).json({success: true})
  }
}
