import {NextApiRequest, NextApiResponse} from 'next'
import {sanityClient} from 'utils/sanity-client'
import {sanityAlgolia} from 'utils/algolia'
import {setupHttpTracing} from '@vercel/tracing-js'
import {withSentry} from '@sentry/nextjs'
import {tracer} from 'utils/honeycomb-tracer'
import {isValidRequest} from '@sanity/webhook'

export const addAllRecordsToAlgolia = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  setupHttpTracing({
    name: addAllRecordsToAlgolia.name,
    tracer,
    req,
    res,
  })

  try {
    if (!isValidRequest(req, process.env.SANITY_WEBHOOK_SECRET)) {
      res.status(403).json({success: false, message: 'Invalid signature'})
    } else {
      // Fetch the _id of all the documents we want to index
      const types = ['section', 'lesson']
      const query = `* [_type in $types][]._id`

      await sanityClient.fetch(query, {types}).then((ids) => {
        sanityAlgolia.webhookSync(sanityClient as any, {
          ids: {created: ids, updated: [], deleted: []},
        })
      })

      res.status(200).send('Success!')
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({success: false, message: error?.message})
  }
}

export default withSentry(addAllRecordsToAlgolia)
