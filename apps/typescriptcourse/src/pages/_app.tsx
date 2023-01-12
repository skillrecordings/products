import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from '@skillrecordings/next-seo'
import config from 'config'
import '../styles/globals.css'
import 'focus-visible'
//TODO: build error if this was in the component after moving it to commerce package
import '@reach/dialog/styles.css'
import {MDXProvider} from '@mdx-js/react'
import MDXComponents from 'components/mdx'
import {usePageview} from '@skillrecordings/analytics'
import {ConvertkitProvider} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {SessionProvider} from 'next-auth/react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {Session} from 'next-auth'

import {trpc} from 'utils/trpc'

const queryClient = new QueryClient()

declare global {
  interface Window {
    ahoy: any
    _cio: any
    fbq: any
    becomeUser: any
    ga: any
  }
}

function MyApp({Component, pageProps}: AppProps<{session: Session}>) {
  usePageview()
  return (
    <>
      <DefaultSeo {...config} />
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <QueryClientProvider client={queryClient}>
          <ConvertkitProvider>
            <MDXProvider components={MDXComponents}>
              <Component {...pageProps} />
            </MDXProvider>
          </ConvertkitProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}

export default trpc.withTRPC(MyApp)
