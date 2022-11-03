import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {orderTranscript} from 'lib/castingwords'
import {updateVideoResource} from 'lib/sanity'
import * as Sentry from '@sentry/nextjs'
import Mux from '@mux/mux-node'

const isTranscriptOrderingEnabled =
  process.env.CASTINGWORDS_TRANSCRIPT_ORDERING_ENABLED
const secret = process.env.SANITY_WEBHOOK_SECRET

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
    if (!isValid) {
      throw new Error('cannot verify Sanity webhook signature')
    } else {
      const {_id, originalMediaUrl, castingwords} = req.body
      console.info('processing Sanity webhook: Video Resource created', _id)

      if (isTranscriptOrderingEnabled) {
        if (!castingwords?.orderId && !castingwords?.transcript) {
          const castingwordsOrder = await orderTranscript(originalMediaUrl)
          console.info(
            'processing Sanity webhook: ordering transcript',
            castingwordsOrder,
          )

          const {Video} = new Mux()

          const muxAsset = await Video.Assets.create({
            input: originalMediaUrl,
            playback_policy: ['public'],
          })

          await updateVideoResource({
            sanityDocumentId: _id,
            castingwordsOrder,
            muxAsset: {
              muxAssetId: muxAsset.id,
              muxPlaybackId: muxAsset.playback_ids?.find((playback_id) => {
                return playback_id.policy === 'public'
              })?.id,
            },
          })
        }
      } else {
        const {Video} = new Mux()
        const muxAsset = await Video.Assets.create({
          input: originalMediaUrl,
          playback_policy: ['public'],
        })

        await updateVideoResource({
          sanityDocumentId: _id,
          muxAsset: {
            muxAssetId: muxAsset.id,
            muxPlaybackId: muxAsset.playback_ids?.find((playback_id) => {
              return playback_id.policy === 'public'
            })?.id,
          },
        })
      }
      res.status(200).json({success: true})
    }
  } catch (e) {
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
