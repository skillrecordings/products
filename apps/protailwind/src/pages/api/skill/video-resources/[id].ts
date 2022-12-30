import {NextApiRequest, NextApiResponse} from 'next'
import {getVideoResource} from '@skillrecordings/skill-lesson/lib/video-resources'

const videoResourceById = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'GET') {
    res.status(200).json(await getVideoResource(req.query.id as string))
  } else {
    res.status(404).end()
  }
}

export default videoResourceById
