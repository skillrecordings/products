import * as React from 'react'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

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
      <Html>
        <Head></Head>
        <body className="bg-gray-900 text-white font-brandon transition-colors duration-100 ease-in-out">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
