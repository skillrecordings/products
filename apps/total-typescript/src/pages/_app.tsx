import React from 'react'
import {AppProps} from 'next/app'
import 'focus-visible'
import '../styles/globals.css'
import {MDXProvider} from '@mdx-js/react'
import {ConvertkitProvider} from '@skillrecordings/convertkit'
import {usePageview} from '@skillrecordings/analytics'
import {DefaultSeo} from '@skillrecordings/react'
import config from '../config'
import Script from 'next/script'
import {MDXComponents} from 'components/mdx'

function MyApp({Component, pageProps}: AppProps) {
  usePageview()
  return (
    <>
      <DefaultSeo {...config} />
      {process.env.NODE_ENV !== 'development' && (
        <>
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-48F495RX7P"
          ></Script>
          <Script id="google-inline">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-48F495RX7P');
        `}
          </Script>
        </>
      )}
      <MDXProvider components={MDXComponents}>
        <ConvertkitProvider>
          <Component {...pageProps} />
        </ConvertkitProvider>
      </MDXProvider>
    </>
  )
}

export default MyApp
