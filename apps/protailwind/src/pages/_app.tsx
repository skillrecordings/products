import React from 'react'
import {AppProps} from 'next/app'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from 'hooks/use-convertkit'
import {QueryClient, QueryClientProvider} from 'react-query'
import {usePageview} from '@skillrecordings/analytics'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'
import config from '../config'

const queryClient = new QueryClient()

function MyApp({Component, pageProps}: AppProps) {
  usePageview()
  initNProgress()
  return (
    <>
      <DefaultSeo {...config} />
      <QueryClientProvider client={queryClient}>
        <ConvertkitProvider>
          <Component {...pageProps} />
        </ConvertkitProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
