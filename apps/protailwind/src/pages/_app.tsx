import React from 'react'
import {AppProps} from 'next/app'
import type {Session} from 'next-auth'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from 'hooks/use-convertkit'
import {QueryClient, QueryClientProvider} from 'react-query'
import {SessionProvider} from 'next-auth/react'
import {usePageview} from '@skillrecordings/analytics'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'
import config from '../config'

const queryClient = new QueryClient()

function MyApp({Component, pageProps}: AppProps<{session: Session}>) {
  usePageview()
  initNProgress()
  return (
    <>
      <DefaultSeo {...config} />
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <QueryClientProvider client={queryClient}>
          <ConvertkitProvider>
            <Component {...pageProps} />
          </ConvertkitProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp
