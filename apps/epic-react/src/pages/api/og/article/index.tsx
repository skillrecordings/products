// @ts-nocheck
import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  try {
    // Fonts
    const fontRegulardData = await fetch(
      new URL(
        '../../../../../public/fonts/inter-regular.woff',
        import.meta.url,
      ),
    ).then((res) => res.arrayBuffer())
    const fontSemiboldData = await fetch(
      new URL(
        '../../../../../public/fonts/inter-semibold.woff',
        import.meta.url,
      ),
    ).then((res) => res.arrayBuffer())
    const {searchParams} = new URL(req.url)
    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title') : 'Article Title'

    return new ImageResponse(
      (
        <div
          tw="flex justify-between items-center flex-row"
          style={{
            width: 1200,
            height: 630,
            color: '#fff',
            background:
              'linear-gradient(249deg, #6266F1 -7.38%, #2454C5 84.02%)',
            padding: '150px 120px',
            fontFamily: 'Inter',
          }}
        >
          <div tw="flex justify-between flex-col h-full">
            <div
              tw="text-7xl flex h-full flex-col"
              style={{
                fontFamily: 'Inter Semibold',
              }}
            >
              {title}
            </div>
            <div tw="flex items-center">
              <img
                src={process.env.NEXT_PUBLIC_URL + '/kent-c-dodds.png'}
                width={88}
                height={88}
                tw="rounded-full bg-blue-800"
              />
              <span tw="text-3xl ml-5">Kent C. Dodds</span>
            </div>
          </div>
          {/* <svg
            tw="text-blue-200"
            width="300"
            height="300"
            viewBox="0 0 35 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.0248 17.799C30.4134 14.361 32.8881 11.0806 31.9625 9.47751C30.6515 7.20671 23.0142 9.16162 14.9042 13.8439C6.79419 18.5263 1.28254 24.1629 2.59359 26.4337C3.30012 27.6574 5.8439 27.6539 9.30882 26.6577"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22.8327 20.2052C19.7805 22.24 17.2819 23.1461 17.4067 23.2574C24.5838 26.982 30.7806 28.481 31.9627 26.4336C33.1745 24.3346 28.5572 19.36 21.4468 14.9214"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.33514 9.26066C5.8567 8.25684 3.30174 8.25022 2.59341 9.47708C1.66081 11.0924 4.18054 14.4108 8.63208 17.8774"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.9263 7.10415C20.0554 3.37385 18.7444 1 17.2781 1C14.656 1 12.5304 8.59153 12.5304 17.9562C12.5304 27.3208 14.656 34.9123 17.2781 34.9123C18.7229 34.9123 20.0169 32.6075 20.8877 28.9713"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
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
