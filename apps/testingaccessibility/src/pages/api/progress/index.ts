import {NextApiRequest, NextApiResponse} from 'next'
import {getDecodedToken} from 'utils/get-decoded-token'
import prisma from 'db'
import {serialize} from 'utils/prisma-next-serializer'
import {withSentry} from '@sentry/nextjs'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from 'utils/honeycomb-tracer'

const getProgress = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({
    name: getProgress.name,
    tracer,
    req,
    res,
  })
  const sessionToken = await getDecodedToken(req)

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

      res.status(200).json(userLessonProgress.map(serialize))
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
