import type {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {prisma} from '@skillrecordings/database'
import {renderCourseCertificate} from '@/certificate/render-course-certificate.server'
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

  try {
    const token = await getToken({req})
    const userId = token?.id
    if (typeof userId !== 'string' || !userId) return res.status(401).end()
    if (!(await canEarnCourseCertificate(userId))) return res.status(403).end()

    const user = await prisma.user.findUnique({
      where: {id: userId},
      select: {name: true},
    })
    if (!user?.name?.trim())
      return res.status(400).send('Please save your name')

    const image = await renderCourseCertificate(user.name)
    res.setHeader('Content-Type', 'image/png')
    return res.send(image)
  } catch {
    return res.status(500).send('Failed to generate the certificate')
  }
}
