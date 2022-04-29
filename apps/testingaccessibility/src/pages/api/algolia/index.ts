import {NextApiRequest, NextApiResponse} from 'next'
import type {SanityClient} from '@sanity/client'
import {sanityClient} from 'utils/sanity-client'
import {sanityAlgolia} from 'utils/algolia'
import {setupHttpTracing} from '@vercel/tracing-js'
import {withSentry} from '@sentry/nextjs'
import {tracer} from 'utils/honeycomb-tracer'
import get from 'lodash/get'

const addRecords = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({
    name: addRecords.name,
    tracer,
    req,
    res,
  })
  // Basic security to prevent others from hitting this API
  const key = get(req.query, 'key')
  if (key !== process.env.NEXT_PUBLIC_ALGOLIA_API_WRITE_KEY) {
    res.status(401).send('Unauthorized')
  } else {
    await sanityAlgolia
      .webhookSync(sanityClient as SanityClient, req.body)
      .then(() => res.status(200).send('Success!'))
      .catch((err: any) => res.status(500).send(`Something went wrong! ${err}`))
  }
}

export default withSentry(addRecords)
