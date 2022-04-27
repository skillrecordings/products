import {NextApiRequest, NextApiResponse} from 'next'
import {getDecodedToken} from 'utils/get-decoded-token'
import {serialize} from 'utils/prisma-next-serializer'
import {getSdk} from 'lib/prisma-api'
import {withSentry} from '@sentry/nextjs'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from 'utils/honeycomb-tracer'
import {defaultContext} from 'lib/context'

const toggleLessonProgressForUser = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const spanContext = setupHttpTracing({
    name: toggleLessonProgressForUser.name,
    tracer,
    req,
    res,
  })
  const sessionToken = await getDecodedToken(req)
  if (req.method === 'POST') {
    try {
      const {toggleLessonProgressForUser} = getSdk({
        ctx: defaultContext,
        spanContext,
      })
      const {slug} = req.query

      if (!sessionToken || !sessionToken.sub) {
        return res.status(403).end('Not Authorized')
      }

      if (!slug) {
        throw new Error('lesson slug is not optional')
      }

      const lessonProgress = await toggleLessonProgressForUser({
        userId: sessionToken.sub,
        lessonSlug: slug as string,
      })
      res.status(200).json(serialize(lessonProgress))
    } catch (error: any) {
      console.error(error.message)
      res.status(400).end(error.message)
    }
  }
}

export default withSentry(toggleLessonProgressForUser)

export const config = {
  api: {
    externalResolver: true,
  },
}
