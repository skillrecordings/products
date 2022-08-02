import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from '@skillrecordings/react'
import config from 'config'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/convertkit'
//TODO: build error if this was in the component after moving it to commerce package
import '@reach/dialog/styles.css'
import {MDXProvider} from '@mdx-js/react'
import MDXComponents from 'components/mdx'
import {usePageview} from '@skillrecordings/analytics'

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
  usePageview()
  return (
    <>
      <DefaultSeo {...config} />
      <ConvertkitProvider>
        <MDXProvider components={MDXComponents}>
          <Component {...pageProps} />
        </MDXProvider>
      </ConvertkitProvider>
    </>
  )
}

export default MyApp
