import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from '@skillrecordings/react'
import config from 'config'
import {ThemeProvider} from 'next-themes'
import 'focus-visible'
import '../styles/globals.css'
import {ViewerProvider} from '@skillrecordings/viewer'
import {ConvertkitProvider} from '@skillrecordings/convertkit'
import MDXComponents from 'components/mdx'
import {MDXProvider} from '@mdx-js/react'

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
          <ThemeProvider forcedTheme="dark" attribute="class">
            <MDXProvider components={MDXComponents}>
              <Component {...pageProps} />
            </MDXProvider>
          </ThemeProvider>
        </ViewerProvider>
      </ConvertkitProvider>
    </>
  )
}

export default MyApp
