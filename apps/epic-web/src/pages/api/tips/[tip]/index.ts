import {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {loadUserForToken} from 'lib/users'
import {getTipVideoForDevice} from 'lib/tips'

const lesson = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const deviceToken = req.headers.authorization?.split(' ')[1]
    const token = await getToken({req})
    const user = await loadUserForToken({token, deviceToken})
    const tipSlug = req.query.tip as string
    const moduleSlug = req.query.module as string
    const sectionSlug = req.query.section as string

    const tipForDevice = await getTipVideoForDevice({
      tipSlug,
      ...(user && {user}),
    })

    if (tipForDevice) {
      res.status(200).json(tipForDevice)
    } else {
      res.status(404).end()
    }
  } else {
    res.status(404).end()
  }
}

export default lesson
