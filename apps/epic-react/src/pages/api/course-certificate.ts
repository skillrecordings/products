import type {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {prisma} from '@skillrecordings/database'
import {renderCourseCertificate} from '@/certificate/render-course-certificate.server'
import {canEarnCourseCertificate} from '@/certificate/course-certificate.server'
import {COURSE_CERTIFICATE_SLUG} from '@/certificate/course-certificate'
import {cloudinary} from '@/utils/cloudinary'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader('Cache-Control', 'private, no-store')
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).end()
  }
  // Cross-origin forms cannot send JSON. This route does not grant CORS access.
  if (
    req.method === 'POST' &&
    req.headers['content-type']?.split(';')[0].trim() !== 'application/json'
  ) {
    return res.status(415).end()
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
    if (req.method === 'POST') {
      // Cloudinary cannot fetch the authenticated endpoint. Send only the PNG
      // rendered from the authenticated learner's saved name.
      const {secure_url} = await cloudinary.uploader.upload(
        `data:image/png;base64,${image.toString('base64')}`,
        {
          public_id: `certificate/${userId}/${COURSE_CERTIFICATE_SLUG}`,
          overwrite: true,
        },
      )
      return res.json({secure_url})
    }
    res.setHeader('Content-Type', 'image/png')
    return res.send(image)
  } catch {
    return res.status(500).send('Failed to generate the certificate')
  }
}
