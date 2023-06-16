import {withSentry} from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'

const sanityVideoResourceWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  console.log('do something')
  fetch(
    `https://deepgram-wrangler.skillstack.workers.dev/transcript?videoUrl=https://egghead-video-uploads.s3.amazonaws.com/epic-web/b346b9aa-dfdd-4865-a516-ee681d4c88d7/2023-01-1114-08-31-inincukvy.mp4`,
  )
  try {
    res.status(200).json({success: true})
  } catch (e) {
    Sentry.captureException(e)
    res.status(200).json({success: true})
  }
}

export default withSentry(sanityVideoResourceWebhook)

export const config = {
  api: {
    externalResolver: true,
  },
}
