import React from 'react'
import {AppProps} from 'next/app'
import type {Session} from 'next-auth'
import {SessionProvider} from 'next-auth/react'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {usePageview} from '@skillrecordings/analytics'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'

import config from '../config'

import {trpc} from 'trpc/trpc.client'

initNProgress()

function MyApp({Component, pageProps}: AppProps<{session: Session}>) {
  usePageview()
  return (
    <>
      <DefaultSeo {...config} />
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <ConvertkitProvider>
          <Component {...pageProps} />
        </ConvertkitProvider>
      </SessionProvider>
    </>
  )
}

export default trpc.withTRPC(MyApp)
