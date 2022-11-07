import React from 'react'
import {AppProps} from 'next/app'
import {Session} from 'next-auth'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from 'hooks/use-convertkit'
import {usePageview} from '@skillrecordings/analytics'
import {DefaultSeo} from '@skillrecordings/next-seo'
import {initNProgress} from '@skillrecordings/react'
import config from '../config'
import Script from 'next/script'
import {MDXProvider} from '@mdx-js/react'
import {MDXComponents} from 'components/mdx'
import {SessionProvider} from 'next-auth/react'
import {QueryClient, QueryClientProvider} from 'react-query'
import * as amplitude from '@amplitude/analytics-browser'
import {withTRPC} from '@trpc/next'
import superjson from 'superjson'
import {httpBatchLink} from '@trpc/client/links/httpBatchLink'
import {loggerLink} from '@trpc/client/links/loggerLink'
import {AppRouter} from 'server/routers/_app'

amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY)

// Database Configuration
const idbConfig = {
  databaseName: 'total-typescript',
  version: 1,
  stores: [
    {
      name: 'progress',
      id: {keyPath: 'id', autoIncrement: true},
      indices: [
        {name: 'eventName', keyPath: 'eventName', options: {unique: false}},
        {name: 'lesson', keyPath: 'lesson', options: {unique: false}},
        {name: 'module', keyPath: 'module', options: {unique: false}},
      ],
    },
  ],
}

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
            <MDXProvider components={MDXComponents}>
              <Component {...pageProps} />
            </MDXProvider>
          </ConvertkitProvider>
        </QueryClientProvider>
      </SessionProvider>
      {process.env.NODE_ENV !== 'development' && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          ></Script>
          <Script id="google-inline">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
          </Script>
        </>
      )}
    </>
  )
}

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

function getEndingLink() {
  return httpBatchLink({
    url: `${getBaseUrl()}/api/trpc`,
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
