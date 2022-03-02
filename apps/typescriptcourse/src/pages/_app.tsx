import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from 'next-seo'
import config from 'config'
import '../styles/globals.css'
import 'focus-visible'
import {ViewerProvider} from '@skillrecordings/viewer'
import {ConvertkitProvider} from '@skillrecordings/convertkit'
import {ThemeProvider} from 'next-themes'
//TODO: build error if this was in the component after moving it to commerce package
import '@reach/dialog/styles.css'
import {MDXProvider} from '@mdx-js/react'
import MDXComponents from 'components/mdx'

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
          <ThemeProvider attribute="class" forcedTheme="dark">
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
