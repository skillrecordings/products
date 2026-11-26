import {readFile} from 'node:fs/promises'
import {join} from 'node:path'
import {ImageResponse} from 'next/og'
import {CertificateTemplate} from './certificate-template'
import {EPIC_REACT_CERTIFICATE_MARK} from './course-certificate'

export async function renderCertificate(
  name: string,
  workshop?: {title: string; image?: string | null},
) {
  const [font, background, mark] = await Promise.all([
    readFile(join(process.cwd(), 'public/fonts/larsseit.woff')),
    readFile(
      join(process.cwd(), 'public/assets/epic-react-certificate-bg.svg'),
    ),
    workshop
      ? null
      : readFile(join(process.cwd(), 'public', EPIC_REACT_CERTIFICATE_MARK)),
  ])

  const image = new ImageResponse(
    (
      <CertificateTemplate
        name={name}
        issuedDate={new Date().toLocaleDateString('en-US', {timeZone: 'UTC'})}
        backgroundImage={`data:image/svg+xml;base64,${background.toString(
          'base64',
        )}`}
        courseMark={
          mark ? `data:image/png;base64,${mark.toString('base64')}` : ''
        }
        workshop={workshop}
      />
    ),
    {
      width: 1684,
      height: 1190,
      fonts: [
        {
          name: 'Larsseit',
          data: new Uint8Array(font).buffer,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  )

  return Buffer.from(await image.arrayBuffer())
}
