import {AppProps} from 'next/app'
import Script from 'next/script'
import type {Session} from 'next-auth'
import '../styles/globals.css'
import {ConvertkitProvider} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {SessionProvider} from 'next-auth/react'
import {usePageview} from '@skillrecordings/analytics'
import {initNProgress} from '@skillrecordings/react'
import {DefaultSeo} from '@skillrecordings/next-seo'
import {trpc} from 'trpc/trpc.client'
import config from '../config'
import {ThemeProvider} from 'next-themes'
import {DM_Sans, JetBrains_Mono} from '@next/font/google'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  weight: ['400', '500', '700'],
})
const jetBransMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrainsmono',
})

function MyApp({Component, pageProps}: AppProps<{session: Session}>) {
  usePageview()
  initNProgress()
  return (
    <>
      <DefaultSeo {...config} />
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="dark"
        disableTransitionOnChange={true}
        // @ts-ignore
        forcedTheme={Component.theme || null}
      >
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <ConvertkitProvider>
            <div
              className={`${dmSans.variable} ${jetBransMono.variable} font-sans antialiased`}
            >
              <Component {...pageProps} />
            </div>
          </ConvertkitProvider>
        </SessionProvider>
      </ThemeProvider>
      {process.env.NODE_ENV !== 'development' && (
        <>
          <Script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
          ></Script>
          <Script id="google-inline">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
          </Script>
        </>
      )}
    </>
  )
}

export default trpc.withTRPC(MyApp)
