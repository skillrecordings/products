import * as React from 'react'
import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for escuelafrontend.com"
          href="/rss.xml"
        />
        <link
          rel="preload"
          href="/fonts/ibm-plex-sans-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/sicret-mono.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="bg-gray-900 text-gray-200 selection:bg-brand selection:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
