import * as Sentry from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'

const sanityVideoResourceWebhook = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  console.log('something was done')
  const data = req.body

  console.log(data)
  try {
    res.status(200).json({success: true})
  } catch (e) {
    Sentry.captureException(e)
    res.status(200).json({success: true})
  }
}

export default sanityVideoResourceWebhook
