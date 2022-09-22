import {createTRPCNext} from '@trpc/next'
import {AppRouter} from 'server/routers/_app'
import {httpBatchLink} from '@trpc/client'

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return ''
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3016}`
}

export const trpc = createTRPCNext<AppRouter>({
  config({ctx}) {
    const ONE_DAY_SECONDS = 60 * 60 * 24
    ctx?.res?.setHeader(
      'Cache-Control',
      `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`,
    )

    const url = `${getBaseUrl()}/api/trpc`

    return {
      links: [
        httpBatchLink({
          url,
        }),
      ],
      // queryClientConfig: {defaultOptions: {queries: {staleTime: 60}}},
    }
  },
  ssr: true,
})
