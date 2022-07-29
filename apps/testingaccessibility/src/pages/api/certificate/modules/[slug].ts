import {NextApiRequest, NextApiResponse} from 'next'
import {drawModuleCertificatePdf} from 'utils/draw-certificate'
import {getModuleProgressForUser} from 'utils/progress'
import {serialize} from 'utils/prisma-next-serializer'
import {
  getAllModuleSlugs,
  getAvailableModulesForUser,
  getModule,
} from 'lib/modules'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '@skillrecordings/skill-api'
import {find, isEmpty} from 'lodash'
import {withSentry} from '@sentry/nextjs'
import {getToken} from 'next-auth/jwt'
import * as Sentry from '@sentry/nextjs'
import {prisma} from '@skillrecordings/database'

const generateModuleCertificate = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  setupHttpTracing({
    name: generateModuleCertificate.name,
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

      const {slug} = req.query

      // get available modules
      const availableModules = await getAvailableModulesForUser(req)

      // determine current module from slug
      const currentModuleSlug: {slug: string} | undefined = find(
        availableModules,
        {
          slug: slug as string,
        },
      )

      const allModules = await getAllModuleSlugs()

      // if the module doesn't exist
      if (isEmpty(find(allModules, {slug: slug}))) {
        return res.status(403).end('Module not found')
      }

      // if the module is not found, they are trying to access module that is not included in their purchase
      if (isEmpty(currentModuleSlug)) {
        return res.status(403).end('Not Authorized')
      }

      // get the current module
      const module = await getModule(currentModuleSlug?.slug as string)

      // check user progress
      const userLessonProgress = await prisma.lessonProgress.findMany({
        where: {
          userId: sessionToken.sub,
        },
      })

      const progress = userLessonProgress.map(serialize)

      const {isCompleted} = getModuleProgressForUser(progress, module.sections)

      if (!isCompleted) {
        return res
          .status(403)
          .end(`You must complete the module in order to get a certificate.`)
      }

      // draw a pdf
      await drawModuleCertificatePdf(req, res, sessionToken, module)
    } catch (error: any) {
      Sentry.captureException(error)
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-get request made')
    res.status(404).end()
  }
}

export default withSentry(generateModuleCertificate)

export const config = {
  api: {
    externalResolver: true,
  },
}
