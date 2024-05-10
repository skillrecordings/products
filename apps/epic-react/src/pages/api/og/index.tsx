// @ts-nocheck
import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  // Images
  const logoImageData = await fetch(
    new URL('/public/assets/og-logo.png', import.meta.url),
  ).then((res) => res.arrayBuffer())

  // Fonts
  const fontRegulardData = await fetch(
    new URL('/public/fonts/inter-regular.woff', import.meta.url),
  ).then((res) => res.arrayBuffer())
  const fontSemiboldData = await fetch(
    new URL('/public/fonts/inter-semibold.woff', import.meta.url),
  ).then((res) => res.arrayBuffer())

  try {
    const {searchParams} = new URL(req.url)
    const moduleTitle = searchParams.get('moduleTitle')
    const moduleImage = searchParams.get('moduleImage')
    const lessonTitle = searchParams.get('lessonTitle')
    const lessonSectionTitle = searchParams.get('lessonSectionTitle')

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#0e182a',
            padding: '30px',
          }}
        >
          <div style={{display: 'flex', width: '100%', marginBottom: '30px'}}>
            <img
              width="250"
              height="70"
              src={logoImageData as any}
              alt="logo image"
              style={{display: 'block'}}
            />
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <img
              width="200"
              height="200"
              src={moduleImage as string}
              alt="Module image"
              style={{display: 'block'}}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              textAlign: 'center',
              color: '#9eddf8',
              fontFamily: 'Inter',
              fontSize: '32px',
              marginBottom: '20px',
            }}
          >
            {moduleTitle}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              textAlign: 'center',
              color: '#ffffff',
              fontFamily: 'Inter Semibold',
              fontSize: '48px',
              paddingLeft: '100px',
              paddingRight: '100px',
            }}
          >
            {lessonTitle}
            {lessonSectionTitle ? `: ${lessonSectionTitle}` : ''}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontRegulardData,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Inter Semibold',
            data: fontSemiboldData,
            style: 'normal',
            weight: 600,
          },
        ],
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
