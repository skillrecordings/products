import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from '@skillrecordings/react'
import config from 'config'
import {ThemeProvider} from 'next-themes'
import '../styles/globals.css'
import 'focus-visible'
import {ViewerProvider} from '@skillrecordings/viewer'
import {ConvertkitProvider} from '@skillrecordings/convertkit'
import {MDXProvider} from '@mdx-js/react'
import mdxComponents from 'components/mdx'

declare global {
  interface Window {
    ahoy: any
    _cio: any
    fbq: any
    becomeUser: any
    ga: any
  }
}

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <DefaultSeo {...config} />
      <ConvertkitProvider>
        <ViewerProvider>
          <ThemeProvider attribute="class" enableSystem>
            <MDXProvider components={mdxComponents}>
              <Component {...pageProps} />
            </MDXProvider>
          </ThemeProvider>
        </ViewerProvider>
      </ConvertkitProvider>
    </>
  )
}

export default MyApp
