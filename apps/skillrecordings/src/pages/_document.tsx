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
          <script
            async
            src="https://platform.twitter.com/widgets.js"
            // charset="utf-8"
          ></script>
        </Head>
        <body className="text-black dark:bg-gray-900 bg-gray-50 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
