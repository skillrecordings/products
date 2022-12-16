import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

const magnatHeadFont = fetch(
  new URL(
    '../../../public/fonts/6fecec1e-f4a1-49a8-8eb2-d3215d7a594e.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

const magnatTextFont = fetch(
  new URL(
    '../../../public/fonts/d5963985-9426-4ddd-9ee9-e0519f89608a.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

const larsseitFont = fetch(
  new URL(
    '../../../public/fonts/de9d52a7-4fdd-4918-a809-30c95835528f.woff',
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
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'My Default Title'
    const hasImage = searchParams.has('image')
    const image = hasImage
      ? searchParams.get('image')
      : 'https://totaltypescript.com/assets/landing/bg-divider-7.png'

    return new ImageResponse(
      (
        <div
          tw="flex w-full relative text-white items-center h-full pl-16 justify-between border-b-8 border-cyan-300"
          style={{
            backgroundColor: '#0A1020',
            backgroundImage: `url(${image})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div tw="flex-1 flex flex-col justify-between h-full pt-12 pb-16 relative">
            <p tw="text-cyan-300" style={{fontSize: 48}}>
              TotalTypeScript.com
            </p>
            <p
              tw="text-7xl tracking-tight font-bold leading-tight"
              style={{
                fontFamily: 'Larsseit',
                lineHeight: 1.1,
              }}
            >
              {title}
            </p>
            <div tw="flex items-center absolute right-14 top-12">
              <img
                src="https://www.mattpocock.com/face.jpeg"
                tw="h-24 rounded-full"
              />
              <p
                style={{fontSize: 36, fontFamily: 'Larsseit'}}
                tw="text-3xl ml-6 mb-6 text-gray-300"
              >
                Matt Pocock
              </p>
            </div>
          </div>
          {/* <img
            src="https://www.mattpocock.com/og-image.jpg"
            tw="h-full"
          /> */}
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
          },
          {
            name: 'Magnat Head',
            data: magnatHeadFontData,
            style: 'normal',
          },
          {
            name: 'Larsseit',
            data: larsseitFontData,
            style: 'normal',
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
