// @ts-nocheck
import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  // Fonts
  const fontRegularData = await fetch(
    new URL('/public/fonts/inter-regular.woff', import.meta.url),
  ).then((res) => res.arrayBuffer())
  const fontSemiboldData = await fetch(
    new URL('/public/fonts/inter-semibold.woff', import.meta.url),
  ).then((res) => res.arrayBuffer())

  try {
    const {searchParams} = new URL(req.url)
    const hasDiscount = searchParams.has('discount')
    const discount = hasDiscount && searchParams.get('discount')
    const defaultBackground =
      process.env.NEXT_PUBLIC_URL + '/epic-react-v2-default-card@2x.jpg'

    return new ImageResponse(
      (
        <div
          tw="flex w-full relative justify-center text-white items-center h-full justify-between"
          style={{
            backgroundColor: '#0A1020',
            backgroundImage: `url(${defaultBackground})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {hasDiscount && (
            <div
              tw="flex items-center justify-center top-5 text-center -right-24 absolute text-black py-1 uppercase"
              style={{
                width: '300px',
                fontFamily: 'Inter Semibold',
                transform: 'rotate(45deg)',
                background: 'linear-gradient(90deg, #FFC75A 0%, #FF9E30 100%)',
                fontSize: '32px',
              }}
            >
              SALE
            </div>
          )}
          {hasDiscount && (
            <div
              tw="absolute flex items-center"
              style={{left: '90px', bottom: '100px'}}
            >
              <div
                tw="px-5 rounded pt-2.5 pb-2 text-black flex text-4xl leading-tight uppercase"
                style={{
                  fontFamily: 'Inter Semibold',
                  fontSize: '40px',
                  background:
                    'linear-gradient(90deg, #FFC75A 0%, #FF9E30 100%)',
                }}
              >
                Save {Number(discount) * 100}%
              </div>
              <div
                tw="flex flex-col justify-center text-amber-300 font-bold uppercase ml-5"
                style={{
                  fontFamily: 'Inter',
                  fontSize: '32px',
                  lineHeight: 1,
                }}
              >
                <div>for limited</div>
                <div>time only</div>
              </div>
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontRegularData,
            style: 'normal',
            weight: 500,
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
