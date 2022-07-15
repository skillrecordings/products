import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Head from 'next/head'
import Script from 'next/script'

function MyApp({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
      {process.env.NODE_ENV !== 'development' && (
        <>
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-48F495RX7P"
          ></Script>
          <Script id="google-inline">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-48F495RX7P');
        `}
          </Script>
        </>
      )}
    </>
  )
}

export default MyApp
