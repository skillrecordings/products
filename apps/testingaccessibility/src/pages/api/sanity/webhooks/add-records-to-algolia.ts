import {NextApiRequest, NextApiResponse} from 'next'
import type {SanityClient} from '@sanity/client'
import {sanityClient} from 'utils/sanity-client'
import {sanityAlgolia} from 'utils/algolia'
import {setupHttpTracing} from '@vercel/tracing-js'
import {withSentry} from '@sentry/nextjs'
import {tracer} from 'utils/honeycomb-tracer'
import {isValidRequest} from '@sanity/webhook'

const secret = process.env.NEXT_PUBLIC_ALGOLIA_API_WRITE_KEY as string

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

  if (!isValidRequest(req, secret)) {
    res.status(403).json({success: false, message: 'Invalid signature'})
    return
  }

  await sanityAlgolia
    .webhookSync(sanityClient as SanityClient, req.body)
    .then(() => res.status(200).send('Success!'))
    .catch((error: any) =>
      res.status(500).json({success: false, message: error}),
    )
}

export default withSentry(addRecordsToAlgolia)
