import * as Sentry from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook'
import {createMuxAsset} from '@skillrecordings/skill-lesson/lib/mux'
import {sanityWriteClient} from '@skillrecordings/skill-lesson/utils/sanity-server'

// at this point we have the video resource which gives us the original media url
// and an object to deal with. we are going to pass that into a cloudflare worker
// that will do the following:

async function initiateVideoTextProcessing({
  videoResourceId,
  originalMediaUrl,
}: {
  videoResourceId: string
  originalMediaUrl: string
}) {
  return fetch(
    `https://deepgram-wrangler.skillstack.workers.dev/transcript?videoUrl=${originalMediaUrl}&videoResourceId=${videoResourceId}`,
  )
}

const sanityVideoResourceWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string
  const isValid = await isValidSignature(
    JSON.stringify(req.body),
    signature,
    process.env.SANITY_WEBHOOK_SECRET,
  )

  try {
    if (isValid) {
      const {_id, originalMediaUrl, muxAsset, duration} = req.body
      console.info('processing Sanity webhook: Video Resource created', _id)

      res.status(200).json({success: true})
    } else {
      res.status(500).json({success: false})
    }
  } catch (e) {
    Sentry.captureException(e)
    res.status(200).json({success: true})
  }
}

export default sanityVideoResourceWebhook
