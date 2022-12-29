import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from '@skillrecordings/next-seo'
import config from 'config'
import {ThemeProvider} from 'next-themes'
import 'focus-visible'
import '../styles/globals.css'
import {ConvertkitProvider} from '@skillrecordings/convertkit-react-ui'
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
        <ThemeProvider forcedTheme="dark" attribute="class">
          <MDXProvider components={MDXComponents}>
            <Component {...pageProps} />
          </MDXProvider>
        </ThemeProvider>
      </ConvertkitProvider>
    </>
  )
}

export default MyApp
