import {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {loadUserForToken} from 'lib/users'
import {getTalkVideoForDevice} from 'lib/talks'

const lesson = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const deviceToken = req.headers.authorization?.split(' ')[1]
    const token = await getToken({req})
    const user = await loadUserForToken({token, deviceToken})
    const talkSlug = req.query.talk as string

    const talkForDevice = await getTalkVideoForDevice({
      talkSlug,
      ...(user && {user}),
    })

    if (talkForDevice) {
      res.status(200).json(talkForDevice)
    } else {
      res.status(404).end()
    }
  } else {
    res.status(404).end()
  }
}

export default lesson
