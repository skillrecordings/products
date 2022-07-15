import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from '@skillrecordings/react'
import config from '../config'
import {ThemeProvider} from 'next-themes'
import {SessionProvider} from 'next-auth/react'
import '../styles/globals.css'
import 'focus-visible'
import {ViewerProvider} from '@skillrecordings/viewer'
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
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <ConvertkitProvider>
          <ViewerProvider>
            <ThemeProvider forcedTheme="dark" attribute="class">
              <Component {...pageProps} />
            </ThemeProvider>
          </ViewerProvider>
        </ConvertkitProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp
