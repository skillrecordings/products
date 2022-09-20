import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {orderTranscript} from 'lib/castingwords'
import {updateVideoResourceWithTranscriptOrderId} from 'lib/sanity'
import * as Sentry from '@sentry/nextjs'
import Mux from '@mux/mux-node'

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

  console.log('SANITY IS INSANE-O')

  try {
    if (!isValid) {
      throw new Error('cannot verify Sanity webhook signature')
    } else {
      const {_id, originalMediaUrl} = req.body
      console.info('processing Sanity webhook: Video Resource created', _id)

      // TODO: Push `originalMediaUrl` to Mux

      const {Video} = new Mux()

      const asset = await Video.Assets.create({
        input: originalMediaUrl,
        playback_policy: [
          'public', // makes playback ID available on the asset
        ],
      })

      console.log({asset})

      // const castingwordsOrder = await orderTranscript(originalMediaUrl)
      // await updateVideoResourceWithTranscriptOrderId(_id, castingwordsOrder)

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
