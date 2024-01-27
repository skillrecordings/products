// @ts-nocheck
import {ImageResponse} from '@vercel/og'
import {NextRequest} from 'next/server'

export const config = {
  runtime: 'edge',
}

const dmSansFont = fetch(
  new URL('../../../public/fonts/DMSans-Medium.ttf', import.meta.url),
).then((res) => res.arrayBuffer())

export default async function handler(req: NextRequest) {
  const dmSansFontData = await dmSansFont

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
        <div
          style={{
            fontFamily: 'DM Sans',
          }}
          tw="flex w-full relative justify-center text-gray-900 items-center h-full pl-16 justify-between border-b-8 border-[#DC6D53] bg-[#F8F7F3]"
        >
          <div tw="flex-1 flex flex-col justify-between h-full pt-12 pb-16 relative">
            <p tw="text-black" style={{fontSize: 48}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="276"
                height="43"
                fill="none"
                viewBox="0 0 276 43"
              >
                <path
                  fill="#000"
                  d="M36.816 32.407c-2.662 5.656-7.819 10.425-16.247 10.425C9.591 42.832.885 35.679.885 23.536c0-12.033 8.595-20.294 20.572-20.294 4.38 0 7.485 1.275 9.98 2.606L32.99 3.63h2.162l.222 14.36h-2.329C30.328 9.508 27.057 5.57 21.734 5.57c-6.765 0-10.59 6.266-10.59 16.968 0 11.755 4.768 16.745 11.532 16.745 5.767 0 9.15-2.883 12.31-7.763l1.83.887Zm31.114-3.382c0 7.707-4.879 13.807-14.36 13.807-7.653 0-13.974-5.102-13.974-13.64 0-8.04 5.49-13.64 14.195-13.64 8.872 0 14.14 5.655 14.14 13.473Zm-8.816-.055c0-5.767-1.053-11.478-5.267-11.478-4.492 0-5.434 6.1-5.434 11.367 0 6.543 1.33 12.032 5.434 12.032 3.881 0 5.267-5.323 5.267-11.921ZM86.134 42H70.441v-1.719c.998-.055 1.663-.166 2.44-.388 1.053-.333 1.441-1.22 1.441-2.44V7.123c0-1.275-.61-2.55-1.497-3.16-.665-.444-2.939-.943-3.937-.999V1.301L81.864.636l.388.388V37.12c0 1.22.444 2.051 1.442 2.495.831.388 1.441.61 2.44.665V42Zm21.321-7.486c-.222 4.492-1.996 8.207-8.096 8.207-5.378 0-7.929-2.828-7.929-7.874V18.933h-4.768v-2.55h4.879V8.509h7.763v7.874h7.319v2.55h-7.264v14.972c0 3.16.5 5.1 3.272 5.1 1.94 0 2.606-2.05 2.717-4.49h2.107Zm44.129-3.548c0 6.764-5.877 11.866-14.86 11.866-5.822 0-9.204-1.775-11.311-2.884l-1.719 2.606h-2.107l-.389-14.25h2.052c2.052 5.268 6.099 12.033 12.476 12.033 4.436 0 7.208-2.773 7.208-6.377 0-2.939-1.996-5.046-6.21-6.487-2.384-.832-5.489-1.72-7.319-2.496-4.769-1.94-7.264-5.933-7.264-10.59 0-5.989 4.99-11.145 13.529-11.145 4.215 0 7.93 1.441 9.926 2.606l1.552-2.218h2.163l.277 13.418h-2.052c-2.273-5.988-4.879-11.367-10.867-11.367-3.494 0-6.1 2.606-6.1 5.822 0 3.05 1.83 4.99 6.155 6.488 2.384.832 5.378 1.719 7.319 2.495 4.436 1.83 7.541 4.602 7.541 10.48Zm22.365 3.548c-.222 4.492-1.996 8.207-8.095 8.207-5.379 0-7.929-2.828-7.929-7.874V18.933h-4.769v-2.55h4.88V8.509h7.762v7.874h7.32v2.55h-7.264v14.972c0 3.16.499 5.1 3.271 5.1 1.941 0 2.606-2.05 2.717-4.49h2.107Zm27.566 1.276c-2.218 3.937-6.654 7.042-12.032 7.042-9.593 0-13.973-6.1-13.973-13.807 0-7.042 4.935-13.474 13.363-13.474 8.76 0 11.921 5.101 11.921 10.979v1.552h-16.801c0 7.209 2.551 11.146 8.262 11.146 3.327 0 5.6-1.664 7.43-4.769l1.83 1.33Zm-9.094-9.815c0-4.325-.665-8.372-3.881-8.372-2.606 0-4.436 2.828-4.547 8.483l8.428-.11Zm37.522 9.815c-2.218 3.937-6.654 7.042-12.032 7.042-9.593 0-13.973-6.1-13.973-13.807 0-7.042 4.935-13.474 13.363-13.474 8.761 0 11.921 5.101 11.921 10.979v1.552h-16.801c0 7.209 2.551 11.146 8.262 11.146 3.327 0 5.6-1.664 7.43-4.769l1.83 1.33Zm-9.094-9.815c0-4.325-.665-8.372-3.881-8.372-2.606 0-4.436 2.828-4.547 8.483l8.428-.11ZM247.226 42h-15.692v-1.719c.998-.055 1.663-.166 2.44-.388 1.053-.333 1.441-1.22 1.441-2.44V7.123c0-1.275-.61-2.55-1.497-3.16-.665-.444-2.938-.943-3.937-.999V1.301l12.975-.665.389.388V37.12c0 1.22.443 2.051 1.441 2.495.832.388 1.442.61 2.44.665V42Zm28.418-6.21c-2.218 3.937-6.653 7.042-12.032 7.042-9.592 0-13.973-6.1-13.973-13.807 0-7.042 4.935-13.474 13.363-13.474 8.761 0 11.922 5.101 11.922 10.979v1.552h-16.801c0 7.209 2.55 11.146 8.262 11.146 3.326 0 5.6-1.664 7.43-4.769l1.829 1.33Zm-9.093-9.815c0-4.325-.665-8.372-3.881-8.372-2.607 0-4.436 2.828-4.547 8.483l8.428-.11Z"
                />
              </svg>

              {type && <span tw="text-white">/{type}</span>}
            </p>
            <div tw="flex flex-col">
              {hasByline && (
                <p tw="uppercase text-3xl text-gray-600 font-semibold">
                  {byline}
                </p>
              )}
              <p
                style={{lineHeight: 1.1}}
                tw="text-7xl tracking-tight font-medium text-black leading-tight pr-10 -mt-2"
              >
                {title}
              </p>
            </div>
            {/* {!hasImage && (
              <div tw="flex items-center absolute right-14 top-12">
                <img
                  src={`${process.env.NEXT_PUBLIC_URL}/instructor.png`}
                  tw="h-24 rounded-full bg-gray-800"
                />
                <p
                  style={{fontSize: 36, fontFamily: 'DM Sans'}}
                  tw="text-3xl ml-6 mb-6 text-gray-600"
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
