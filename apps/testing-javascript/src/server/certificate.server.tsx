import {ImageResponse} from '@vercel/og'
import {type NextRequest} from 'next/server'

const fontMedium = fetch(
  new URL(
    '../../public/fonts/5df2ffcf-6190-4c99-adea-e678cb3fcad8.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

export default async function handleCreateCertificate(req: NextRequest) {
  const fontMediumData = await fontMedium

  try {
    const {searchParams} = new URL(req.url)

    const issuedDate = new Date().toLocaleDateString()
    const hasName = searchParams.has('name')
    const name = hasName ? searchParams.get('name') : 'Your Name'

    const CertificateTemplate = () => {
      const backgroundImage =
        'https://res.cloudinary.com/epic-web/image/upload/v1684446868/testingjavascript.com/illos/certificate.png'

      return (
        <div
          tw="flex w-full relative items-center h-full justify-center"
          style={{
            backgroundColor: '#0A1020',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div tw="flex justify-center w-full h-full text-body">
            <p
              tw="text-7xl leading-none absolute top-[550px]"
              style={{fontFamily: 'TT Commons W01 Medium'}}
            >
              {name}
            </p>
            <div
              tw="absolute text-3xl text-right bottom-[105px] left-[235px]"
              style={{fontFamily: 'TT Commons W01 Medium'}}
            >
              {issuedDate}
            </div>
          </div>
        </div>
      )
    }

    return new ImageResponse(<CertificateTemplate />, {
      width: 1684,
      height: 1191,
      fonts: [
        {
          name: 'TT Commons W01 Medium',
          data: fontMediumData,
          style: 'normal',
          weight: 400,
        },
      ],
    })
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the certificate`, {
      status: 500,
    })
  }
}
