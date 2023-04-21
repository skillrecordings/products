import * as React from 'react'
import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="preload"
          href="/fonts/499f3b52-6c48-40e5-9a4a-7d76f57bc82d.woff"
          as="font"
          type="font/woff"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/941bd4ef-6d96-4cc3-b891-b967fb693919.woff"
          as="font"
          type="font/woff"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/5df2ffcf-6190-4c99-adea-e678cb3fcad8.woff"
          as="font"
          type="font/woff"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/9a718670-1649-4925-a033-3a8b409e3a39.woff"
          as="font"
          type="font/woff"
          crossOrigin=""
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
