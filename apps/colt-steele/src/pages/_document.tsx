import * as React from 'react'
import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="font-serif bg-brand-cultured text-brand-cola">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
