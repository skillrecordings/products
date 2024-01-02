import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

const larsseitFont = fetch(
  new URL(
    `${process.env.NEXT_PUBLIC_URL}/fonts/de9d52a7-4fdd-4918-a809-30c95835528f.woff`,
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

const larsseitBoldFont = fetch(
  new URL(
    `${process.env.NEXT_PUBLIC_URL}/fonts/65c4497d-8c6b-45b3-b338-01b6f20be34d.woff`,
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const larsseitFontData = await larsseitFont
  const larsseitBoldFontData = await larsseitBoldFont

  try {
    const {searchParams} = new URL(req.url)
    const hasDiscount = searchParams.has('discount')
    const discount = hasDiscount && searchParams.get('discount')
    const defaultBackground =
      'https://totaltypescript.com/card-sale-template@2x.png'

    return new ImageResponse(
      (
        <div
          tw="flex w-full relative justify-center text-white items-center h-full pl-16 justify-between"
          style={{
            backgroundColor: '#0A1020',
            backgroundImage: `url(${defaultBackground})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {hasDiscount && (
            <div
              tw="absolute flex items-center"
              style={{left: '67px', bottom: '76px'}}
            >
              <div
                tw="px-6 pt-2 pb-4 flex text-4xl leading-tight uppercase"
                style={{
                  fontFamily: 'LarsseitBold',
                  color: '#0A1020',
                  fontSize: '40px',
                  background:
                    'linear-gradient(98deg, #FDE047 8.18%, #FBBF24 101.66%)',
                }}
              >
                Save {Number(discount) * 100}%
              </div>
              <div
                tw="flex flex-col justify-center text-yellow-300 font-bold uppercase ml-5"
                style={{
                  fontFamily: 'Larsseit',
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
            name: 'Larsseit',
            data: larsseitFontData,
            style: 'normal',
            weight: 500,
          },
          {
            name: 'LarsseitBold',
            data: larsseitBoldFontData,
            style: 'normal',
            weight: 700,
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
