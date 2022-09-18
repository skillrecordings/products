import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'

const secret = process.env.SANITY_WEBHOOK_ORDER_TRANSCRIPT_SECRET

const createCastingwordsOrder = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const signature = req.headers[SIGNATURE_HEADER_NAME]
  const isValid = isValidSignature(JSON.stringify(req.body), signature, secret)

  if (!isValid) {
    res.status(401).json({success: false, message: 'Invalid signature'})
    return
  }

  console.log(req.body)
  res.json({success: true})
}

export default withSentry(createCastingwordsOrder)
