// @ts-nocheck
import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

const dmSansFont = fetch(
  new URL('../../../../public/fonts/DMSans-Bold.ttf', import.meta.url),
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const dmSansFontData = await dmSansFont

  try {
    const {searchParams} = new URL(req.url)
    const hasPercentageDiscount = searchParams.has('percentageDiscount')
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

    if (hasPercentageDiscount) {
      const percentageDiscount = searchParams.get('percentageDiscount')
      const backgroundImageUrl =
        'https://res.cloudinary.com/epic-web/image/upload/v1696939073/default-gen-share-card-bg_2x.png'

      return new ImageResponse(
        (
          <div
            tw="flex w-full relative justify-center text-white items-center h-full pl-16 justify-between"
            style={{
              fontFamily: 'DM Sans',
              backgroundImage: `url(${backgroundImageUrl})`,
            }}
          >
            <div
              tw="flex text-black items-center absolute justify-center"
              style={{
                fontSize: 40,
                bottom: 95,
                left: 117,
                fontFamily: 'DM Sans Bold',
              }}
            >
              Save {percentageDiscount * 100}%
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
    }

    return new ImageResponse(
      (
        <div
          tw="flex w-full relative h-full"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/card@2x.png)`,
          }}
        />
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'DM Sans',
            data: dmSansFontData,
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
