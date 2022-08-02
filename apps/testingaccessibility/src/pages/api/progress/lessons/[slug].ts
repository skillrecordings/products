import {NextApiRequest, NextApiResponse} from 'next'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {getSdk, defaultContext} from '@skillrecordings/database'
import {withSentry} from '@sentry/nextjs'
import {tracer, setupHttpTracing} from '@skillrecordings/honeycomb-tracer'
import {getToken} from 'next-auth/jwt'

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
  const sessionToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
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
      res.status(200).json(convertToSerializeForNextResponse(lessonProgress))
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
