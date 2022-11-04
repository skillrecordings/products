import * as React from 'react'
import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html lang="es">
      <Head />
      <body className="bg-gray-900 text-white antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
