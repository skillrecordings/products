import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from '@skillrecordings/next-seo'
import config from 'config'
import {ThemeProvider} from 'next-themes'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/convertkit'

declare global {
  interface Window {
    ahoy: any
    _cio: any
    fbq: any
    becomeUser: any
    ga: any
  }
}

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <DefaultSeo {...config} />
      <ConvertkitProvider>
        <ThemeProvider forcedTheme="light" attribute="class">
          <Component {...pageProps} />
        </ThemeProvider>
      </ConvertkitProvider>
    </>
  )
}

export default MyApp
