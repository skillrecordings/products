import {NextApiRequest, NextApiResponse} from 'next'
import {sanityClient} from 'utils/sanity-client'
import {sanityAlgolia} from 'utils/algolia'
import {setupHttpTracing} from '@vercel/tracing-js'
import {withSentry} from '@sentry/nextjs'
import {tracer} from 'utils/honeycomb-tracer'
import {isValidRequest} from '@sanity/webhook'

const addRecordsToAlgolia = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  setupHttpTracing({
    name: addRecordsToAlgolia.name,
    tracer,
    req,
    res,
  })

  try {
    if (!isValidRequest(req, process.env.SANITY_WEBHOOK_SECRET)) {
      res.status(403).json({success: false, message: 'Invalid signature'})
    } else {
      await sanityAlgolia.webhookSync(sanityClient as any, req.body)

      res.status(200).send('Success!')
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({success: false, message: error.message})
  }
}

export default withSentry(addRecordsToAlgolia)
