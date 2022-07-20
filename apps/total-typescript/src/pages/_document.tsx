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
        <link rel="stylesheet" href="https://use.typekit.net/phg4qbq.css" />
      </Head>
      <body className="bg-gray-900 text-white subpixel-antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
