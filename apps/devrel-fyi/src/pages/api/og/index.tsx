// @ts-nocheck
import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

const font = fetch(
  new URL(
    '../../../../public/fonts/a8455863-362b-408b-9e87-abf87d85cc02.ttf',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const fontData = await font

  try {
    const {searchParams} = new URL(req.url)
    const hasTitle = searchParams.has('title')
    const hasByline = searchParams.has('byline')
    const byline = hasByline ? searchParams.get('byline') : ''
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'My Default Title'
    const hasImage = searchParams.has('image')
    const image = searchParams.get('image')
    const hasType = searchParams.has('type')
    const type = hasType ? searchParams.get('type') : ''

    return new ImageResponse(
      (
        <div
          tw="flex w-full relative justify-center text-black items-center h-full justify-between"
          style={{
            backgroundColor: '#B9F8D7',
          }}
        >
          <div tw="flex-1 flex flex-col justify-start h-full p-12 px-18 pr-24 relative">
            {hasImage ? (
              <div tw="flex items-center">
                <img src={image} width={200} height={200} tw="mr-10" />
                {hasByline && (
                  <p tw="text-5xl leading-tight font-semibold">{byline}</p>
                )}
              </div>
            ) : (
              <Logo />
            )}
            <p
              tw="tracking-tight leading-tight"
              style={{
                fontSize: '4.2rem',
                fontFamily: 'DM Sans',
                lineHeight: 1.1,
              }}
            >
              {title}
            </p>
            {/* {!hasImage && (
              <div tw="flex items-center absolute right-14 top-12">
                <img
                  src={`${process.env.NEXT_PUBLIC_URL}/theo.jpg`}
                  tw="h-24 rounded-full bg-gray-100"
                />
                <p
                  style={{fontSize: 36, fontFamily: 'DM Sans'}}
                  tw="text-3xl ml-6 mb-6"
                >
                  {process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME}{' '}
                  {process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}
                </p>
              </div>
            )} */}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'DM Sans',
            data: fontData,
            style: 'normal',
            weight: 500,
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

const Logo = () => {
  return <div />
}
