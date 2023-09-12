import * as React from 'react'
import {Html, Head, Main, NextScript} from 'next/document'
import {maisonNeue, maisonNeueMono} from '@/utils/load-fonts'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={`${maisonNeue.variable} ${maisonNeueMono.variable} font-sans antialiased`}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
