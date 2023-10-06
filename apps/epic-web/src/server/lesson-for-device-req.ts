import {getToken} from 'next-auth/jwt'
import {getLessonVideoForDevice} from 'lib/lessons'
import {NextApiRequest, NextApiResponse} from 'next'
import {loadUserForToken} from 'lib/users'

export async function lessonForDeviceReq({
  req,
  res,
  isSolution = false,
}: {
  req: NextApiRequest
  res: NextApiResponse
  isSolution?: boolean
}) {
  if (req.method === 'GET') {
    const deviceToken = req.headers.authorization?.split(' ')[1]
    const token = await getToken({req})
    const user = await loadUserForToken({token, deviceToken})
    const lessonSlug = req.query.lesson as string
    const moduleSlug = req.query.module as string
    const sectionSlug = req.query.section as string

    if (user) {
      const lessonForDevice = await getLessonVideoForDevice({
        lessonSlug,
        moduleSlug,
        sectionSlug,
        user,
        useSolution: isSolution,
      })

      if (lessonForDevice) {
        res.status(200).json(lessonForDevice)
      } else {
        res.status(404).end()
      }
    } else {
      res.status(403).end()
    }
  } else {
    res.status(404).end()
  }
}