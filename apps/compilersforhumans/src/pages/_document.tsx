import * as React from 'react'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'

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
        <Head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          {/* <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" /> */}
          <link rel="mask-icon" href="/mask-icon.svg" sizes="any" color="red" />
        </Head>
        <body className="dark:bg-black bg-gray-50 dark:text-white text-black transition-colors duration-100 ease-in-out">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
