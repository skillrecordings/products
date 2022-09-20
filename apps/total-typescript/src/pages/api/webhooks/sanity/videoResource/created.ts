import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {orderTranscript} from 'lib/castingwords'
import {updateVideoResourceWithTranscriptOrderId} from 'lib/sanity'

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

  console.info('processing Sanity webhook: Video Resource created')

  try {
    if (!isValid) {
      res.status(401).json({success: false, message: 'invalid signature'})
    } else {
      const {_id, originalMediaUrl} = req.body

      const castingwordsOrder = await orderTranscript(originalMediaUrl)
      await updateVideoResourceWithTranscriptOrderId(_id, castingwordsOrder)

      res.status(200).json({success: true})
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({success: false})
  }
}

export default withSentry(sanityVideoResourceWebhook)

export const config = {
  api: {
    externalResolver: true,
  },
}
