import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from '@skillrecordings/next-seo'
import config from 'config'
import {ThemeProvider} from 'next-themes'
import '../styles/globals.css'
import 'focus-visible'
import {ConvertkitProvider} from '@skillrecordings/convertkit-react-ui'
import {MDXProvider} from '@mdx-js/react'
import mdxComponents from 'components/mdx'
import {Inter} from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

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
        <ThemeProvider attribute="class" enableSystem>
          <MDXProvider components={mdxComponents}>
            <div className={`${inter.variable} font-sans`}>
              <Component {...pageProps} />
            </div>
          </MDXProvider>
        </ThemeProvider>
      </ConvertkitProvider>
    </>
  )
}

export default MyApp
