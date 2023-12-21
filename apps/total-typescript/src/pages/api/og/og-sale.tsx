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

export default async function handler(req: NextRequest) {
  const larsseitFontData = await larsseitFont

  try {
    const {searchParams} = new URL(req.url)
    const hasDiscount = searchParams.has('discount')
    const discount = hasDiscount && searchParams.get('discount')
    const defaultBackground = `${process.env.NEXT_PUBLIC_URL}/card-sale-template@2x.png`

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
              style={{left: '67px', bottom: '72px'}}
            >
              <div
                tw="px-6 py-4 flex text-4xl leading-none uppercase font-extrabold bg-yellow-500"
                style={{fontFamily: 'Larsseit', color: '#0A1020'}}
              >
                Save {Number(discount) * 100}%
              </div>
              <div
                tw="flex flex-col justify-center text-3xl text-yellow-500 font-bold uppercase leading-none ml-5"
                style={{fontFamily: 'Larsseit'}}
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
