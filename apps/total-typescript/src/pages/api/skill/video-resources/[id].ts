import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {z} from 'zod'
import {getVideoResource} from 'video/video-resource'

const verifyModuleAccess = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'GET') {
    res.status(200).json(await getVideoResource(req.query.id as string))
  } else {
    res.status(404).end()
  }
}

export default withSentry(verifyModuleAccess)
export const config = {
  api: {
    externalResolver: true,
  },
}
