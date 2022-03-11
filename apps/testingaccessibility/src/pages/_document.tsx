import * as React from 'react'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import {GoogleSnippet} from '@skillrecordings/analytics'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      styles: <>{initialProps.styles}</>,
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.png" />
          <link
            rel="mask-icon"
            href="/mask-icon.svg"
            sizes="any"
            color="#DA6E47"
          />
          <GoogleSnippet />
        </Head>
        <body className="text-black bg-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
