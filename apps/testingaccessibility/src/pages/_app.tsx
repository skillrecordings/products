import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from 'next-seo'
import config from 'config'
import {ThemeProvider} from 'next-themes'
import 'focus-visible'
import '../styles/globals.css'
import {ViewerProvider} from '@skillrecordings/viewer'
import {ConvertkitProvider} from '@skillrecordings/convertkit'
import MDXComponents from 'components/mdx'
import {MDXProvider} from '@mdx-js/react'
import {SessionProvider} from 'next-auth/react'
import {usePageview} from '@skillrecordings/analytics'
import {QueryClient, QueryClientProvider} from 'react-query'
import {initNProgress} from 'utils/nprogress'

const queryClient = new QueryClient()

declare global {
  interface Window {
    ahoy: any
    _cio: any
    fbq: any
    becomeUser: any
    ga: any
    gtag: any
  }
}

initNProgress()

function MyApp({Component, pageProps}: AppProps) {
  usePageview()
  return (
    <>
      <DefaultSeo {...config} />
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <ConvertkitProvider>
            <ViewerProvider>
              <ThemeProvider enableSystem={false} attribute="class">
                <MDXProvider components={MDXComponents}>
                  <Component {...pageProps} />
                </MDXProvider>
              </ThemeProvider>
            </ViewerProvider>
          </ConvertkitProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
