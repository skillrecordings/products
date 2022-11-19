import * as React from 'react'
import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for escuelafrontend.com"
          href="/rss.xml"
        />
      </Head>
      <body className="bg-gray-900 text-gray-200 selection:bg-brand selection:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
