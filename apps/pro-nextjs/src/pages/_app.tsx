import React from 'react'
import {AppProps} from 'next/app'
import '../styles/globals.css'
import {ConvertkitProvider} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {usePageview} from '@skillrecordings/analytics'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'
import {MDXProvider} from '@mdx-js/react'
import {SessionProvider} from 'next-auth/react'
import * as amplitude from '@amplitude/analytics-browser'
import {FeedbackProvider} from '@skillrecordings/feedback-widget'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import config from '../config'
import {trpc} from '@/trpc/trpc.client'
import Script from 'next/script'
import {Session} from 'next-auth'
import {SearchProvider} from '@/search-bar/use-search-bar'
import {maisonNeue, maisonNeueMono} from '@/utils/load-fonts'

if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
  amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY)
}

const isGoogleAnalyticsAvailable =
  process.env.NODE_ENV !== 'development' &&
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS

function MyApp({Component, pageProps}: AppProps<{session: Session}>) {
  usePageview()
  initNProgress()
  return (
    <>
      <DefaultSeo {...config} />
      <FeedbackProvider>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <ConvertkitProvider>
            <SearchProvider>
              <MDXProvider>
                <div
                  className={`relative ${maisonNeue.variable} ${maisonNeueMono.variable} antialised font-sans`}
                >
                  <Component {...pageProps} />
                </div>
              </MDXProvider>
            </SearchProvider>
          </ConvertkitProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </SessionProvider>
      </FeedbackProvider>
      {isGoogleAnalyticsAvailable && (
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
