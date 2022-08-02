import {NextApiRequest, NextApiResponse} from 'next'
import {prisma} from '@skillrecordings/database'
import {convertToSerializeForNextResponse} from 'utils/prisma-next-serializer'
import {withSentry} from '@sentry/nextjs'
import {tracer, setupHttpTracing} from '@skillrecordings/honeycomb-tracer'
import {getToken} from 'next-auth/jwt'

const getProgress = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({
    name: getProgress.name,
    tracer,
    req,
    res,
  })
  const sessionToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (req.method === 'GET') {
    try {
      if (!sessionToken || !sessionToken.sub) {
        return res.status(403).end('Not Authorized')
      }

      const userLessonProgress = await prisma.lessonProgress.findMany({
        where: {
          userId: sessionToken.sub,
        },
      })

      res
        .status(200)
        .json(userLessonProgress.map(convertToSerializeForNextResponse))
    } catch (error: any) {
      console.error(error.message)
      res.status(400).end(error.message)
    }
  }
}

export default withSentry(getProgress)

export const config = {
  api: {
    externalResolver: true,
  },
}
