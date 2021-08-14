import React from 'react'
import { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import config from '../../config'
import { ThemeProvider } from 'next-themes'
import '../styles/globals.css'
import 'focus-visible'
import { ViewerProvider } from 'contexts/viewer-context'
import { ConvertkitProvider } from 'contexts/convertkit-context'

declare global {
  interface Window {
    ahoy: any
    _cio: any
    fbq: any
    becomeUser: any
    ga: any
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo {...config} />
      <ConvertkitProvider>
        <ViewerProvider>
          <ThemeProvider attribute="class">
            <Component {...pageProps} />
          </ThemeProvider>
        </ViewerProvider>
      </ConvertkitProvider>
    </>
  )
}

export default MyApp
