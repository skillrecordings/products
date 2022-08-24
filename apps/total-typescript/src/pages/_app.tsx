import React from 'react'
import {AppProps} from 'next/app'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/convertkit'
import {usePageview} from '@skillrecordings/analytics'
import {DefaultSeo} from '@skillrecordings/next-seo'
import {initNProgress} from '@skillrecordings/react'
import config from '../config'
import Script from 'next/script'
import {MDXProvider} from '@mdx-js/react'
import {MDXComponents} from 'components/mdx'

function MyApp({Component, pageProps}: AppProps) {
  usePageview()
  initNProgress()
  return (
    <>
      <DefaultSeo {...config} />
      <MDXProvider components={MDXComponents}>
        <ConvertkitProvider>
          <Component {...pageProps} />
        </ConvertkitProvider>
      </MDXProvider>
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

          gtag('config', ${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS});
        `}
          </Script>
        </>
      )}
    </>
  )
}

export default MyApp
