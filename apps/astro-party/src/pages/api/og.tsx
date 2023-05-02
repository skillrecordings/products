import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

const dmSansFont = fetch(
  new URL('../../../public/fonts/DMSans-Medium.ttf', import.meta.url),
).then((res) => res.arrayBuffer())

const cooperFont = fetch(
  new URL('../../../public/fonts/Cooper.ttf', import.meta.url),
).then((res) => res.arrayBuffer())

const fredokaFont = fetch(
  new URL('../../../public/fonts/Fredoka-Bold.ttf', import.meta.url),
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const dmSansFontData = await dmSansFont
  const cooperFontData = await cooperFont
  const fredokaFontData = await fredokaFont

  try {
    const {searchParams} = new URL(req.url)
    const hasTitle = searchParams.has('title')
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'My Default Title'
    const hasImage = searchParams.has('image')
    const image = searchParams.get('image')
    const hasByline = searchParams.has('byline')
    const byline = searchParams.get('byline')
    const hasType = searchParams.has('type')
    const type = hasType ? searchParams.get('type') : ''

    return new ImageResponse(
      (
        <div tw="flex w-full relative justify-center text-black items-center h-full pl-16 justify-between bg-[#00A156]">
          <div tw="flex-1 flex flex-col justify-between h-full pt-12 pb-16 relative">
            <p
              tw="text-center flex flex-col uppercase font-bold"
              style={{fontSize: 40, fontFamily: 'Fredoka', lineHeight: 0.95}}
            >
              <div>Astro</div>
              <div>Party</div>
            </p>
            <div tw="flex flex-col">
              {hasByline && (
                <p tw="uppercase text-3xl  font-semibold">{byline}</p>
              )}
              <p
                style={{lineHeight: 1.1, fontFamily: 'Cooper'}}
                tw="text-8xl tracking-tight font-medium leading-tight pr-10 -mt-2"
              >
                {title}
              </p>
            </div>
            {/* {!hasImage && (
              <div tw="flex items-center absolute right-14 top-12">
                <img
                  src={`${process.env.NEXT_PUBLIC_URL}/jason-lengstorf.jpg`}
                  tw="h-24 rounded-full bg-gray-800"
                />
                <p
                  style={{fontSize: 36, fontFamily: 'DM Sans'}}
                  tw="text-3xl ml-6 mb-6 "
                >
                  {appConfig.author}
                </p>
              </div>
            )} */}
          </div>
          {hasImage && image && (
            <div tw="flex items-center justify-center flex-shrink-0 pr-10">
              <img src={image} width={500} height={500} />
            </div>
          )}
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
          {
            name: 'Cooper',
            data: cooperFontData,
            style: 'normal',
            weight: 500,
          },
          {
            name: 'Fredoka',
            data: fredokaFontData,
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
