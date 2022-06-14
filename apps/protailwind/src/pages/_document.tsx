import * as React from 'react'
import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/phg4qbq.css" />
      </Head>
      <body className="text-white bg-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
