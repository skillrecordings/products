import * as React from 'react'
import {Html, Head, Main, NextScript} from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="preload"
          href="/fonts/c0fdf756-27c7-46b6-ade5-d04ede3fbf9b.woff2"
          as="font"
          type="font/woff"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/56184c9a-0155-4961-a836-516c2a37949d.woff2"
          as="font"
          type="font/woff"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/ad9be1db-493d-445e-aeb8-16a5cca6cde9.woff2"
          as="font"
          type="font/woff"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/c7e2cf7d-6add-43b2-8bd9-f68faa219cb6.woff2"
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
