import {ImageResponse} from '@vercel/og'
import {type NextRequest} from 'next/server'
// import Balancer from 'react-wrap-balancer'

const fontRegular = fetch(
  new URL('../../public/fonts/Espiritu-Regular.woff', import.meta.url),
).then((res) => res.arrayBuffer())

const fontCondensed = fetch(
  new URL('../../public/fonts/Espiritu-Condensed.woff', import.meta.url),
).then((res) => res.arrayBuffer())

export default async function handleCreateOgImage(req: NextRequest) {
  const fontRegularData = await fontRegular
  const fontCondensedData = await fontCondensed

  try {
    const {searchParams} = new URL(req.url)

    const title = searchParams.get('title')
    const subtitle = searchParams.get('subtitle')
    const image = searchParams.get('image')

    const OgImageTemplate = () => {
      const backgroundImage =
        'https://res.cloudinary.com/badass-courses/image/upload/v1685130321/og-images/mushrooms_andy2o.png'

      return (
        <div
          tw="flex w-full relative h-full"
          style={{backgroundColor: '#040308'}}
        >
          {image ? (
            <div
              tw="flex w-[630px] h-[630px] absolute right-0 top-0"
              style={{
                backgroundImage: `url(${image})`,
                backgroundPosition: 'right 50px',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
              }}
            />
          ) : (
            <div tw="flex w-80 absolute top-20 right-8">
              <img src={backgroundImage} alt="" tw="flex w-full" />
            </div>
          )}
          <div tw="pl-8 pt-20 flex flex-col relative">
            <div tw="flex items-center ml-48">
              <img
                src="https://res.cloudinary.com/badass-courses/image/upload/v1684983712/og-images/skull_2x_pk3ph8.png"
                alt="badass logo"
                tw="flex h-[128px] w-[128px]"
              />
              <div tw="flex items-baseline">
                <div tw="text-[3rem] text-white leading-none">Badass</div>
                <div
                  tw="text-[28px] text-[#FDB854] leading-[1.1]"
                  style={{fontFamily: 'Espiritu Condensed'}}
                >
                  .DEV
                </div>
              </div>
            </div>
            <div tw="flex flex-col items-center w-[880px] text-center">
              {title && (
                <h2
                  tw="text-8xl text-white"
                  style={{
                    fontFamily: 'Espiritu Regular',
                  }}
                >
                  {title}
                  {/* <Balancer>{decodeURI(title)}</Balancer> */}
                </h2>
              )}
              {subtitle && (
                <h3
                  tw="text-[2.5rem] text-[#FDB854] tracking-wide"
                  style={{fontFamily: 'Espiritu Condensed'}}
                >
                  {subtitle}
                </h3>
              )}
            </div>
          </div>
        </div>
      )
    }

    return new ImageResponse(<OgImageTemplate />, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Espiritu Regular',
          data: fontRegularData,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Espiritu Condensed',
          data: fontCondensedData,
          style: 'normal',
          weight: 400,
        },
      ],
    })
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the og image`, {
      status: 500,
    })
  }
}
