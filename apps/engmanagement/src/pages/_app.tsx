import React from 'react'
import {AppProps} from 'next/app'
import {Session} from 'next-auth'
import {DefaultSeo} from '@skillrecordings/next-seo'
import config from '../config'
import {ThemeProvider} from 'next-themes'
import {SessionProvider} from 'next-auth/react'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/convertkit-react-ui'
import {QueryClient, QueryClientProvider} from 'react-query'

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
  return (
    <>
      <DefaultSeo {...config} />
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <ConvertkitProvider>
            <ThemeProvider forcedTheme="dark" attribute="class">
              <Component {...pageProps} />
            </ThemeProvider>
          </ConvertkitProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
