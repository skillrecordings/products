import React from 'react'
import {AppProps} from 'next/app'
import config from 'config'
import '../styles/globals.css'
import 'focus-visible'
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
        <Component {...pageProps} />
      </ConvertkitProvider>
    </>
  )
}

export default MyApp
