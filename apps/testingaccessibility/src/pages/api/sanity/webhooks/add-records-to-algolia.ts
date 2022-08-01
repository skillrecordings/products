import {NextApiRequest, NextApiResponse} from 'next'
import {sanityClient} from 'utils/sanity-client'
import {sanityAlgolia} from 'utils/algolia'
import {tracer, setupHttpTracing} from '@skillrecordings/honeycomb-tracer'
import {withSentry} from '@sentry/nextjs'
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
      const ids = {
        created: req.body.ids.created.filter((id: any) => !!id),
        updated: req.body.ids.updated.filter((id: any) => !!id),
        deleted: req.body.ids.deleted.filter((id: any) => !!id),
      }
      console.log(req.body)
      console.log(ids)

      await sanityAlgolia
        .webhookSync(sanityClient as any, {ids})
        .catch((e: any) => {
          throw e
        })

      res.status(200).send('Success!')
    }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      res
        .status(500)
        .json({success: false, message: error.message, body: req.body})
    } else {
      res.status(500).json({
        success: false,
        message: 'unknown error occurred',
        body: req.body,
      })
    }
  }
}

export default withSentry(addRecordsToAlgolia)
