import {SanityDocument} from '@sanity/client'
import {NextApiRequest, NextApiResponse} from 'next'
import getSlug from 'speakingurl'

export const downloadCertificateImage = async (
  req: NextApiRequest,
  res: NextApiResponse,
  sessionToken: any,
  module: SanityDocument,
) => {
  const userName = req.query.name || sessionToken.name || ''

  const certificateImageUrl =
    process.env.CERTIFICATE_URI +
    `/api/certificate?name=${userName}&resource=${module.title}`
  const image = await fetch(certificateImageUrl).then(({body}) => body)
  const fileName = `certificate-${getSlug(`${userName}`)}@2x.png`

  res.setHeader('Content-Type', 'image/png')
  res.setHeader('Content-disposition', `attachment; filename=${fileName}`)
  res.send(image)
}
