import React from 'react'
import {AppProps} from 'next/app'
import '../styles/globals.css'
import '../styles/fonts.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/convertkit'
import {usePageview} from '@skillrecordings/analytics'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'

import config from '../config'
import Script from 'next/script'

initNProgress()

function MyApp({Component, pageProps}: AppProps) {
  usePageview()
  return (
    <>
      <DefaultSeo {...config} />
      <ConvertkitProvider>
        <Component {...pageProps} />
      </ConvertkitProvider>
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

export default MyApp
