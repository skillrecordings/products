import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {orderTranscript} from 'lib/castingwords'
import {updateVideoResourceWithTranscriptOrderId} from 'lib/sanity'
import * as Sentry from '@sentry/nextjs'
import Mux from '@mux/mux-node'

const secret = process.env.SANITY_WEBHOOK_SECRET

async function createCastingWordsOrder({
  originalMediaUrl,
  castingwords,
}: {
  originalMediaUrl: string
  castingwords: {orderId: string; transcript: any[]; audioFileId: number}
}) {
  if (!castingwords?.orderId && !castingwords?.transcript) {
    return await orderTranscript(originalMediaUrl)
  }

  return {order: castingwords.orderId, audiofiles: [castingwords.audioFileId]}
}

async function createMuxAsset({
  originalMediaUrl,
  muxAsset,
}: {
  originalMediaUrl: string
  muxAsset: {muxAssetId: string; muxPlaybackId: string}
}) {
  if (!muxAsset?.muxAssetId) {
    const {Video} = new Mux()
    const newMuxAsset = await Video.Assets.create({
      input: originalMediaUrl,
      playback_policy: ['public'],
    })

    return {
      muxAssetId: newMuxAsset.id,
      muxPlaybackId: newMuxAsset.playback_ids?.find((playback_id) => {
        return playback_id.policy === 'public'
      })?.id,
    }
  }

  return muxAsset
}

/**
 * link to webhook {@link} https://www.sanity.io/organizations/om9qNpcXE/project/z9io1e0u/api/webhooks/xV5ZY6656qclI76i
 *
 * @param req
 * @param res
 */
const sanityVideoResourceWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string
  const isValid = isValidSignature(JSON.stringify(req.body), signature, secret)

  try {
    if (isValid) {
      const {_id, originalMediaUrl, castingwords, muxAsset} = req.body
      console.info('processing Sanity webhook: Video Resource created', _id)

      await updateVideoResourceWithTranscriptOrderId({
        sanityDocumentId: _id,
        castingwordsOrder: await createCastingWordsOrder({
          originalMediaUrl,
          castingwords,
        }),
        muxAsset: await createMuxAsset({originalMediaUrl, muxAsset}),
      })
      res.status(200).json({success: true})
    } else {
      res.status(500).json({success: false})
    }
  } catch (e) {
    console.log('error', e)
    Sentry.captureException(e)
    res.status(200).json({success: true})
  }
}

export default withSentry(sanityVideoResourceWebhook)

export const config = {
  api: {
    externalResolver: true,
  },
}
