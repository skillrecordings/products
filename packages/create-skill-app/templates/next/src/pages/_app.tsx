import React from 'react'
import {AppProps} from 'next/app'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/convertkit-react-ui'
import {usePageview} from '@skillrecordings/analytics'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'

import config from '../config'

import {trpc} from 'trpc/trpc.client'

initNProgress()

function MyApp({Component, pageProps}: AppProps) {
  usePageview()
  return (
    <>
      <DefaultSeo {...config} />
      <ConvertkitProvider>
        <Component {...pageProps} />
      </ConvertkitProvider>
    </>
  )
}

export default trpc.withTRPC(MyApp)
