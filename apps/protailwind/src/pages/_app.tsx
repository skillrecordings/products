import React from 'react'
import {AppProps} from 'next/app'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/convertkit'
import {usePageview} from '@skillrecordings/analytics'
import {DefaultSeo, initNProgress} from '@skillrecordings/react'
import config from '../config'

function MyApp({Component, pageProps}: AppProps) {
  usePageview()
  initNProgress()
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
