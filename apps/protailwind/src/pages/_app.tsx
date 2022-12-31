import React from 'react'
import {AppProps} from 'next/app'
import type {Session} from 'next-auth'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {SessionProvider} from 'next-auth/react'
import {usePageview} from '@skillrecordings/analytics'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'
import config from '../config'
import {trpc} from 'utils/trpc'
import Script from 'next/script'

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

export default trpc.withTRPC(MyApp)
