import React from 'react'
import {AppProps} from 'next/app'
import config from 'config'
import '../styles/globals.css'
import 'focus-visible'
import {ViewerProvider} from '@skillrecordings/viewer'
import {ConvertkitProvider} from '@skillrecordings/convertkit'
import {DefaultSeo} from '@skillrecordings/react'

//TODO: build error if this was in the component after moving it to commerce package
import '@reach/dialog/styles.css'

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
        <ViewerProvider>
          <Component {...pageProps} />
        </ViewerProvider>
      </ConvertkitProvider>
    </>
  )
}

export default MyApp
