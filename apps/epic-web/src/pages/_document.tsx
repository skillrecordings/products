import * as React from 'react'
import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-gray-900 text-yellow-50 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
