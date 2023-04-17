// @ts-nocheck
import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

const articulatFont = fetch(
  new URL(
    '../../../public/a84a9075-f8c5-4f4e-9fcd-70937ed6f0d7.woff',
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const articulatFontData = await articulatFont

  try {
    const {searchParams} = new URL(req.url)
    const hasTitle = searchParams.has('title')
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'My Default Title'
    const hasType = searchParams.has('type')
    const hasUser = searchParams.has('user')
    const user = hasUser ? searchParams.get('user') : undefined
    const hasAuthor = searchParams.has('author')
    const author = hasAuthor ? searchParams.get('author') : undefined
    const type = hasType ? searchParams.get('type') : ''
    const defaultBackground =
      'https://totaltypescript.com/assets/landing/bg-divider-7.png'
    const logo = 'https://scriptkit.com/assets/kit-icon-1.png'

    return new ImageResponse(
      (
        <div
          style={{
            margin: 0,
            padding: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 1200,
            height: 630,
            backgroundColor: '#000',
            fontFamily: '"Articulat", sans-serif',
          }}
        >
          <img
            src={logo}
            tw="absolute"
            style={{
              right: 100,
              top: 100,
            }}
          />
          <div
            tw="text-7xl"
            style={{
              position: 'absolute',
              top: 135,
              left: 100,
              width: 700,
              height: 130,
              color: '#ffffff',
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          {user && (
            <div tw="absolute left-24 bottom-24 flex items-center flex">
              <img
                width={100}
                height={100}
                tw="rounded-full"
                src={`https://github.com/${user}.png`}
              />
              <div tw="pl-4 text-white text-3xl flex">
                {author ? author : user}
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
            name: 'Articulat',
            data: articulatFontData,
            style: 'normal',
            weight: 300,
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
