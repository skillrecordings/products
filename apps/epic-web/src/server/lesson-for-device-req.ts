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

    const lessonForDevice = await getLessonVideoForDevice({
      lessonSlug,
      moduleSlug,
      sectionSlug,
      ...(user && {user}),
      useSolution: isSolution,
      country: req.headers['x-vercel-ip-country'] as string,
    })

    if (!('error' in lessonForDevice)) {
      res.status(200).json(lessonForDevice)
    } else {
      if (
        lessonForDevice.error === 'lesson-not-found' ||
        lessonForDevice.error === 'video-resource-not-found'
      ) {
        res.status(404).end()
      } else if (lessonForDevice.error === 'unauthorized-to-view-lesson') {
        // unauthorized
        res.status(401).end()
      } else if (user) {
        if (lessonForDevice?.error === 'region-restricted') {
          const requestCountry = req.headers['x-vercel-ip-country'] as string
          const restrictedCountry = user?.purchases?.filter(
            (purchase) => purchase.status === 'Restricted',
          )[0]?.country
          res.status(200).json({
            requestCountry,
            restrictedCountry,
            isRegionRestricted:
              lessonForDevice?.error === 'region-restricted' ||
              requestCountry !== restrictedCountry,
          })
        }
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
