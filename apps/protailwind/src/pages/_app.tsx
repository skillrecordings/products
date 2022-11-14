import React from 'react'
import {AppProps} from 'next/app'
import type {Session} from 'next-auth'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from 'hooks/use-convertkit'
import {QueryClient, QueryClientProvider} from 'react-query'
import {SessionProvider} from 'next-auth/react'
import {usePageview} from '@skillrecordings/analytics'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'
import config from '../config'
import {withTRPC} from '@trpc/next'
import superjson from 'superjson'
import {httpBatchLink} from '@trpc/client/links/httpBatchLink'
import {loggerLink} from '@trpc/client/links/loggerLink'
import {AppRouter} from 'server/routers/_app'

const queryClient = new QueryClient()

function MyApp({Component, pageProps}: AppProps<{session: Session}>) {
  usePageview()
  initNProgress()
  return (
    <>
      <DefaultSeo {...config} />
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <QueryClientProvider client={queryClient}>
          <ConvertkitProvider>
            <Component {...pageProps} />
          </ConvertkitProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}

function getEndingLink() {
  return httpBatchLink({
    url: `${process.env.NEXT_PUBLIC_URL}/api/trpc`,
  })
}

export default withTRPC<AppRouter>({
  config({ctx}) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === 'development' &&
              typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        getEndingLink(),
      ],
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {defaultOptions: {queries: {staleTime: 60}}},
      headers: () => {
        if (ctx?.req) {
          // on ssr, forward client's headers to the server
          return {
            ...ctx.req.headers,
            'x-ssr': '1',
          }
        }
        return {}
      },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp)
