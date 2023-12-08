import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import * as Sentry from '@sentry/nextjs'

import {inngest} from '@/utils/inngest.server'

const secret = process.env.SANITY_WEBHOOK_SECRET as string

export const sanityArticleWebhook = async (
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
      console.log('valid Sanity webhook: Article updated')
      try {
        console.log('article updated', req.body)

        await inngest.send({
          name: 'article/updated',
          data: req.body,
        })

        return res.json({status: 'ok'})
      } catch (err) {
        console.error('Error revalidating', err)
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating')
      }
    } else {
      res.status(500).json({success: false})
    }
  } catch (e) {
    Sentry.captureException(e)
    res.status(200).json({success: true})
  }
}

export default sanityArticleWebhook
