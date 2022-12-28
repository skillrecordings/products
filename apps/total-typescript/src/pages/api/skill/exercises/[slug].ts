import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {getExercise} from 'lib/exercises'

const exerciseBySlugHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'GET' && req.query.slug) {
    // auth check here
    const exercise = await getExercise(req.query.slug as string)
    res.status(200).json(exercise)
  } else {
    res.status(404).end()
  }
}

export default withSentry(exerciseBySlugHandler)
export const config = {
  api: {
    externalResolver: true,
  },
}
