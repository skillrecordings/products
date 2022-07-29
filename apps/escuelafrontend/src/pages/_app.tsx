import React from 'react'
import {AppProps} from 'next/app'
import {DefaultSeo} from '@skillrecordings/react'
import config from '../config.json'
import {ThemeProvider} from 'next-themes'
import '../styles/globals.css'
import 'focus-visible'
import {useEffect} from 'react'
import {useRouter} from 'next/router'
import * as gtag from '../lib/gtag'
import AppLayout from 'components/app/layout'
import MDXComponents from 'components/mdx'
import {MDXProvider} from '@mdx-js/react'
import {SessionProvider} from 'next-auth/react'

declare global {
  interface Window {
    ahoy: any
    _cio: any
    fbq: any
    becomeUser: any
    ga: any
  }
}

const App: React.FC<React.PropsWithChildren<AppProps>> = ({
  Component,
  pageProps,
}) => {
  const AppComponent = Component as any

  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: any) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const getLayout =
    AppComponent.getLayout ||
    ((Page: any) => (
      <AppLayout>
        <Page {...pageProps} />
      </AppLayout>
    ))

  return (
    <>
      <DefaultSeo {...config} />
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <MDXProvider components={MDXComponents}>
            {getLayout(Component, pageProps)}
          </MDXProvider>
        </ThemeProvider>
      </SessionProvider>
    </>
  )
}

export default App
