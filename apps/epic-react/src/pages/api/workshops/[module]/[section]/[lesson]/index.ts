import {NextApiRequest, NextApiResponse} from 'next'
import {lessonForDeviceReq} from '@/server/lesson-for-device-req'

const lesson = async (req: NextApiRequest, res: NextApiResponse) => {
  await lessonForDeviceReq({req, res})
}

export default lesson
