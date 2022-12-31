import React from 'react'
import {AppProps} from 'next/app'
import {Session} from 'next-auth'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'
import config from 'config'
import 'focus-visible'
import '../styles/globals.css'
import {ConvertkitProvider} from '@skillrecordings/convertkit-react-ui'
import MDXComponents from 'components/mdx'
import {MDXProvider} from '@mdx-js/react'
import {SessionProvider} from 'next-auth/react'
import {usePageview} from '@skillrecordings/analytics'
import {QueryClient, QueryClientProvider} from 'react-query'
import {ProgressProvider} from 'context/progress-context'
import {FeedbackProvider} from 'context/feedback-context'

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

function MyApp({Component, pageProps}: AppProps<{session: Session}>) {
  usePageview()
  return (
    <>
      <DefaultSeo {...config} />
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <ConvertkitProvider>
            <MDXProvider components={MDXComponents}>
              <ProgressProvider>
                <FeedbackProvider>
                  <Component {...pageProps} />
                </FeedbackProvider>
              </ProgressProvider>
            </MDXProvider>
          </ConvertkitProvider>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
