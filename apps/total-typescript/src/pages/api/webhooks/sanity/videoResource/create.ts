import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {orderTranscript} from 'lib/castingwords'
import {updateVideoResourceWithTranscriptOrderId} from 'lib/sanity'

// TODO: Just a sanity secret not so specific
const secret = process.env.SANITY_WEBHOOK_ORDER_TRANSCRIPT_SECRET

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
      res.status(401).json({success: false, message: 'Invalid signature'})
    } else {
      const {_id, originalMediaUrl} = req.body

      const castingwordsOrder = await (
        await orderTranscript(originalMediaUrl)
      ).json()

      const {order, audiofiles} = castingwordsOrder

      updateVideoResourceWithTranscriptOrderId(
        _id,
        order,
        String(audiofiles[0]),
      )

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
