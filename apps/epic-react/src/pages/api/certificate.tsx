import type {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {prisma} from '@skillrecordings/database'
import {getModuleById} from '@skillrecordings/skill-lesson/lib/modules'
import {renderCertificate} from '@/certificate/certificate-handler.server'
import {EPIC_REACT_COURSE_PRODUCT_ID} from '@/certificate/course-certificate'
import {canEarnCourseCertificate} from '@/certificate/course-certificate.server'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader('Cache-Control', 'private, no-store')
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).end()
  }

  const {moduleId, productId, name} = req.query

  try {
    let image: Buffer
    if (productId !== undefined) {
      if (
        productId !== EPIC_REACT_COURSE_PRODUCT_ID ||
        moduleId !== undefined
      ) {
        return res.status(400).send('Invalid course certificate request')
      }

      const token = await getToken({req})
      const userId = token?.id
      if (typeof userId !== 'string' || !userId) return res.status(401).end()
      if (!(await canEarnCourseCertificate(userId)))
        return res.status(403).end()

      const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {name: true},
      })
      if (!user?.name?.trim())
        return res.status(400).send('Please save your name')
      image = await renderCertificate(user.name)
    } else {
      if (typeof moduleId !== 'string' || typeof name !== 'string') {
        return res.status(400).send('Please provide a workshop and a name')
      }
      const workshop = await getModuleById(moduleId)
      if (!workshop) return res.status(404).end()
      image = await renderCertificate(name, workshop)
    }

    res.setHeader('Content-Type', 'image/png')
    return res.send(image)
  } catch {
    return res.status(500).send('Failed to generate the certificate')
  }
}
