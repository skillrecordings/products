import React from 'react'
import {AppProps} from 'next/app'
import type {Session} from 'next-auth'
import {SessionProvider} from 'next-auth/react'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {usePageview} from '@skillrecordings/analytics'
import {DefaultSeo} from '@skillrecordings/next-seo'

import config from '../config'

import {trpc} from '@/trpc/trpc.client'
import {initNProgress} from '@skillrecordings/skill-lesson/utils/init-nprogess'
import {GoldenTicketProvider} from '@skillrecordings/skill-lesson/hooks/use-golden-ticket'

function MyApp({Component, pageProps}: AppProps<{session: Session}>) {
  usePageview()
  initNProgress()
  return (
    <>
      <DefaultSeo {...config} />
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <ConvertkitProvider>
          <GoldenTicketProvider>
            <Component {...pageProps} />
          </GoldenTicketProvider>
        </ConvertkitProvider>
      </SessionProvider>
    </>
  )
}

export default trpc.withTRPC(MyApp)
