import {ImageResponse} from '@vercel/og'
import Image from 'next/image'
import {type NextRequest} from 'next/server'
import Balancer from 'react-wrap-balancer'

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
        'https://res.cloudinary.com/epic-web/image/upload/v1684446868/testingjavascript.com/illos/certificate.png'

      return (
        <div
          tw="flex w-full relative h-full"
          style={{backgroundColor: '#040308'}}
        >
          {/* &image=https%3A%2F%2Fres.cloudinary.com%2Fbadass-courses%2Fimage%2Fupload%2Fv1684982685%2Fog-images%2Ftest2_gp06g1.png */}
          {image && (
            <div
              tw="flex w-[760px] h-full absolute right-0 top-0"
              style={{
                backgroundImage: `url(${image})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100%',
                backgroundPosition: '0 0',
              }}
            />
          )}
          <div tw="pl-8 pt-20 flex flex-col relative">
            <div tw="flex items-center ml-48">
              <img
                src="https://res.cloudinary.com/badass-courses/image/upload/v1684983712/og-images/skull_2x_pk3ph8.png"
                alt="badass logo"
                tw="block h-[128px] w-[128px]"
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
            <div tw="flex flex-col items-center max-w-[880px] text-center">
              <h2
                tw="text-8xl text-white"
                style={{fontFamily: 'Espiritu Regular'}}
              >
                {title}
                {/* <Balancer>{title}</Balancer> */}
              </h2>
              <h3
                tw="text-[2.5rem] text-[#FDB854] tracking-wide"
                style={{fontFamily: 'Espiritu Condensed'}}
              >
                {subtitle}
              </h3>
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
