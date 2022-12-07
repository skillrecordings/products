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

export default async function handler(req: NextRequest) {
  const magnatHeadFontData = await magnatHeadFont
  const magnatTextFontData = await magnatTextFont
  try {
    const {searchParams} = new URL(req.url)

    const hasTitle = searchParams.has('title')
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'My Default Title'

    return new ImageResponse(
      (
        <div
          tw="flex w-full text-white items-center h-full pl-16 justify-between"
          style={{
            backgroundColor: '#0f172a',
          }}
        >
          <div tw="flex-1 flex flex-col justify-between h-full py-12">
            <p tw="text-3xl text-cyan-300">TotalTypeScript.com</p>
            <p
              tw="text-6xl tracking-tight font-bold leading-tight my-0"
              style={{
                fontFamily: 'Magnat Head',
                zIndex: '1',
              }}
            >
              {title}
            </p>
            <div tw="flex items-center">
              <img
                src="https://www.mattpocock.com/face.jpeg"
                tw="h-24 rounded-full"
              ></img>
              <p tw="text-2xl ml-6">By Matt Pocock</p>
            </div>
          </div>
          <img
            src="https://www.mattpocock.com/og-image.jpg"
            style={{zIndex: '0'}}
            tw="h-full"
          />
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
