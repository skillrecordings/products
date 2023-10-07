import {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {loadUserForToken} from 'lib/users'
import {getCurrentAbility} from '@skillrecordings/skill-lesson'
import {getTalk} from 'lib/talks'

type GetTalkVideoForDeviceProps = {
  talkSlug: string
  user?: any
}
export async function getTalkVideoForDevice({
  talkSlug,
  user,
}: GetTalkVideoForDeviceProps) {
  const talk = await getTalk(talkSlug)
  const ability = getCurrentAbility({
    user,
    lesson: talk,
  })

  if (ability.can('view', 'Content')) {
    return {
      title: talk.title,
      description: talk.description,
      summary: talk.summary,
      muxPlaybackId: talk.muxPlaybackId,
      transcript: talk.transcript,
      httpUrl: `${process.env.NEXT_PUBLIC_URL}/talks/${talk.slug}}`,
    }
  }
}

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
