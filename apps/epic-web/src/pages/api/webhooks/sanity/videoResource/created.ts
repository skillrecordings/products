import * as Sentry from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {inngest} from 'inngest/inngest.server'
import {VIDEO_RESOURCE_CREATED_EVENT} from 'inngest/events'

// Disable body parsing so we can access the raw body for signature validation
export const config = {
  api: {
    bodyParser: false,
  },
}

// Helper to read raw body
async function readBody(req: NextApiRequest): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

/**
 * Sanity Webhook: Video Resource Created
 *
 * Triggered when a new videoResource document is created in Sanity.
 * Emits VIDEO_RESOURCE_CREATED_EVENT to start the video processing pipeline:
 * 1. Create Mux asset
 * 2. Order Deepgram transcript
 * 3. (After Deepgram callback) Add SRT to Mux + Generate SEO description
 */
const sanityVideoResourceWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'POST') {
    return res.status(405).json({error: 'Method not allowed'})
  }

  // Read raw body for signature validation
  const rawBody = await readBody(req)
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string

  const isValid = await isValidSignature(
    rawBody,
    signature,
    process.env.SANITY_WEBHOOK_SECRET,
  )

  if (!isValid) {
    console.error('Sanity webhook: Invalid signature')
    return res.status(401).json({error: 'Invalid signature'})
  }

  // Parse the body after validation
  const body = JSON.parse(rawBody)

  try {
    const {_id, originalMediaUrl} = body

    if (!_id || !originalMediaUrl) {
      console.error('Sanity webhook: Missing required fields', {
        _id,
        originalMediaUrl,
      })
      return res.status(400).json({error: 'Missing _id or originalMediaUrl'})
    }

    console.info(`Sanity webhook: Video Resource created - ${_id}`)

    // Emit event to trigger video processing pipeline
    await inngest.send({
      name: VIDEO_RESOURCE_CREATED_EVENT,
      data: {
        videoResourceId: _id,
        originalMediaUrl,
      },
    })

    console.info(
      `Sanity webhook: Emitted VIDEO_RESOURCE_CREATED_EVENT for ${_id}`,
    )

    return res.status(200).json({success: true, videoResourceId: _id})
  } catch (error) {
    console.error('Sanity webhook error:', error)
    Sentry.captureException(error)
    return res.status(500).json({error: 'Internal server error'})
  }
}

export default sanityVideoResourceWebhook
