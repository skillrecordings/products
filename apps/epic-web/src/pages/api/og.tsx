import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

const dmSansFont = fetch(
  new URL('../../../public/fonts/DMSans-Medium.ttf', import.meta.url),
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const dmSansFontData = await dmSansFont

  try {
    const {searchParams} = new URL(req.url)
    const hasTitle = searchParams.has('title')
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
          tw="flex w-full relative justify-center text-white items-center h-full pl-16 justify-between border-b-8 border-indigo-300"
          style={{
            backgroundColor: '#040404',
          }}
        >
          {hasImage && (
            <div
              tw="absolute left-0 top-0 w-full h-full opacity-25"
              style={{
                width: 1920 / 1.2,
                height: 1080 / 1.2,
                backgroundColor: '#0A1020',
                backgroundImage: `url(${image})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
          <div tw="flex-1 flex flex-col justify-between h-full pt-12 pb-16 relative">
            <p tw="text-indigo-200" style={{fontSize: 48}}>
              EpicWeb.dev{type && <span tw="text-white">/{type}</span>}
            </p>
            <p
              tw="text-7xl tracking-tight font-bold leading-tight pr-16"
              style={{
                fontFamily: 'DM Sans',
                lineHeight: 1.1,
              }}
            >
              {title}
            </p>
            <div tw="flex items-center absolute right-14 top-12">
              <img
                src="https://www.epicweb.dev/kent-c-dodds.png"
                tw="h-24 rounded-full bg-gray-800"
              />
              <p
                style={{fontSize: 36, fontFamily: 'DM Sans'}}
                tw="text-3xl ml-6 mb-6 text-gray-300"
              >
                Kent C. Dodds
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'DM Sans',
            data: dmSansFontData,
            style: 'normal',
            weight: 400,
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
