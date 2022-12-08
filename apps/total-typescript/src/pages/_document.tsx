import * as React from 'react'
import {Html, Head, Main, NextScript} from 'next/document'
import Fonts from 'utils/fonts'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for TotalTypeScript.com"
          href="/rss.xml"
        />
        <Fonts />
      </Head>
      <body className="bg-gray-900 text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
