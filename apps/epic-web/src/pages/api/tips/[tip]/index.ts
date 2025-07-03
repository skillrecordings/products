import {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {loadUserForToken} from 'lib/users'
import {getCurrentAbility} from '@skillrecordings/skill-lesson'
import {getTip} from 'lib/tips.server'

type GetTipVideoForDeviceProps = {
  tipSlug: string
  user?: any
}
export async function getTipVideoForDevice({
  tipSlug,
  user,
}: GetTipVideoForDeviceProps) {
  const tip = await getTip(tipSlug)
  const ability = getCurrentAbility({
    user,
    lesson: tip,
  })

  if (ability.can('view', 'Content')) {
    return {
      title: tip.title,
      description: tip.description,
      summary: tip.summary,
      muxPlaybackId: tip.muxPlaybackId,
      transcript: tip.transcript,
      httpUrl: `${process.env.NEXT_PUBLIC_URL}/tips/${tip.slug}}`,
    }
  }
}

const lesson = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const deviceToken = req.headers.authorization?.split(' ')[1]
    const token = await getToken({req})
    const user = await loadUserForToken({token, deviceToken})
    const tipSlug = req.query.tip as string

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
