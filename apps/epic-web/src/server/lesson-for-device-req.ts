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

    console.log(
      'CURRENT USER COUNTRY VIA VERCEL',
      req.headers['x-vercel-ip-country'] as string,
    )

    const lessonSlug = req.query.lesson as string
    const moduleSlug = req.query.module as string
    const sectionSlug = req.query.section as string

    const lessonForDevice = await getLessonVideoForDevice({
      lessonSlug,
      moduleSlug,
      sectionSlug,
      ...(user && {user}),
      useSolution: isSolution,
    })
    if (lessonForDevice) {
      res.status(200).json(lessonForDevice)
    } else {
      if (user) {
        // unauthorized
        res.status(403).end()
      } else {
        // unauthenticated
        res.status(401).end()
      }
    }
  } else {
    res.status(404).end()
  }
}
