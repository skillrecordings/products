import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

const magnatHeadFont = fetch(
  new URL(
    '../../../styles/fonts/6fecec1e-f4a1-49a8-8eb2-d3215d7a594e.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

const magnatTextFont = fetch(
  new URL(
    '../../../styles/fonts/d5963985-9426-4ddd-9ee9-e0519f89608a.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

const larsseitFont = fetch(
  new URL(
    '../../../styles/fonts/de9d52a7-4fdd-4918-a809-30c95835528f.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const magnatHeadFontData = await magnatHeadFont
  const magnatTextFontData = await magnatTextFont
  const larsseitFontData = await larsseitFont

  try {
    const {searchParams} = new URL(req.url)
    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title') : 'My Default Title'
    const hasImage = searchParams.has('image')
    const image = hasImage ? searchParams.get('image') : null

    const defaultBackground =
      'https://res.cloudinary.com/total-typescript/image/upload/v1716212898/book-og-bg_2x_mwyjot.jpg'

    return new ImageResponse(
      (
        <div
          tw="flex w-full relative justify-center text-white items-center h-full justify-between border-b-8 border-cyan-300"
          style={{
            backgroundColor: '#0E1523',
            backgroundImage: `url(${defaultBackground})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div tw="flex flex-row items-center justify-between h-full py-24 pl-10 relative">
            {image && <img src={image} width={450} height={450} />}
            <div tw="flex flex-col pl-10">
              <p
                tw="text-4xl leading-none"
                style={{
                  fontFamily: 'Magnat Text',
                  lineHeight: 0.1,
                  color: '#67DFEB',
                }}
              >
                Total TypeScript
              </p>
              <p
                tw="text-7xl tracking-tight text-center font-bold max-w-xl text-left"
                style={{
                  fontFamily: 'Larsseit',
                  //   lineHeight: 1.1,
                }}
              >
                {title}
              </p>
              <div tw="flex items-center gap-2 pt-5">
                <img
                  src="https://www.totaltypescript.com/matt-pocock.jpg"
                  tw="h-20 rounded-full"
                />
                <p
                  style={{fontSize: 36, fontFamily: 'Larsseit'}}
                  tw="text-3xl ml-6 mb-6 text-gray-300"
                >
                  Matt Pocock
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Magnat Text',
            data: magnatTextFontData,
            style: 'normal',
            weight: 300,
          },
          {
            name: 'Magnat Head',
            data: magnatHeadFontData,
            style: 'normal',
            weight: 600,
          },
          {
            name: 'Larsseit',
            data: larsseitFontData,
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
