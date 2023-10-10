import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {
  const logoImageData = await fetch(
    new URL('/public/images/og/logo-full.png', import.meta.url),
  ).then((res) => res.arrayBuffer())
  const trophyImageData = await fetch(
    new URL('/public/images/og/trophy.png', import.meta.url),
  ).then((res) => res.arrayBuffer())
  const kentImageData = await fetch(
    new URL('/public/images/og/kent-c-dodds.png', import.meta.url),
  ).then((res) => res.arrayBuffer())
  const fontDemiboldData = await fetch(
    new URL(
      '/public/fonts/9a718670-1649-4925-a033-3a8b409e3a39.woff',
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer())
  const fontRegulardData = await fetch(
    new URL(
      '/public/fonts/941bd4ef-6d96-4cc3-b891-b967fb693919.woff',
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer())

  // const {searchParams} = request.nextUrl
  // const title = searchParams.get('title')
  // if (!title) {
  //   return new ImageResponse(<>Visit with &quot;?title=vercel&quot;</>, {
  //     width: 1200,
  //     height: 630,
  //   })
  // }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 64,
          lineHeight: 1.2,
          fontFamily: '"TT Commons W01 DemiBold"',
          color: '#1b1b1f',
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff',
          padding: '40px',
        }}
      >
        <div style={{display: 'flex', width: '100%'}}>
          <img
            width="424"
            height="94"
            src={logoImageData as any}
            alt="logo image"
            style={{position: 'absolute', top: '0', left: '0'}}
          />
        </div>
        <div style={{display: 'flex', width: '100%', alignItems: 'center'}}>
          <div
            style={{
              width: '65%',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '140px',
            }}
          >
            Learn the smart,
            <br />
            efficient way to test any
            <br />
            JavaScript application.
            <div
              style={{display: 'flex', alignItems: 'center', marginTop: '40px'}}
            >
              <div
                style={{
                  display: 'flex',
                  overflow: 'hidden',
                  borderRadius: '50%',
                }}
              >
                <img
                  src={kentImageData as any}
                  alt="Kent C. Dodds image"
                  style={{width: '100px', height: '100px'}}
                />
              </div>
              <div
                style={{
                  marginLeft: '20px',
                  fontSize: '40px',
                  fontFamily: '"TT Commons W01 Regular"',
                }}
              >
                Kent C. Dodds
              </div>
            </div>
          </div>
          <div
            style={{width: '35%', display: 'flex', justifyContent: 'center'}}
          >
            <img
              src={trophyImageData as any}
              alt="logo image"
              style={{width: '260px'}}
            />
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'TT Commons W01 Regular',
          data: fontRegulardData,
          style: 'normal',
        },
        {
          name: 'TT Commons W01 DemiBold',
          data: fontDemiboldData,
          style: 'normal',
        },
      ],
    },
  )
}
