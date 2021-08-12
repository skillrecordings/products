import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from 'next-seo'
import config from '../config'
import {MDXProvider} from '@mdx-js/react'
import '../styles/globals.css'
import 'focus-visible'
import {ViewerProvider} from 'contexts/viewer-context'
import {ConvertkitProvider} from 'contexts/convertkit-context'
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
          <MDXProvider components={mdxComponents}>
            <Component {...pageProps} />
          </MDXProvider>
        </ViewerProvider>
      </ConvertkitProvider>
    </>
  )
}

export default MyApp
