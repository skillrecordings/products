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
          <link
            href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
          <link href="https://use.typekit.net/ple1qqc.css" rel="stylesheet" />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="RSS Feed for testingaccessibility.com"
            href="/rss.xml"
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
