import * as React from 'react'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import {GA_TRACKING_ID} from '../lib/gtag'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
    }
  }

  render() {
    return (
      <Html lang="es">
        <Head>
          {/* preloading fonts */}

          <link
            rel="preload"
            href="/fonts/f0f7918a-6c09-4345-a519-2bf54215f05c.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/c9c3cd7d-c142-46f3-a083-d2d8e80fd885.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/2b34360d-61b4-4f6f-85a7-7c6da6d6f8ef.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/a1f3c79b-054e-45f6-89d6-5515a80abbaa.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/81f9ae10-5315-4e91-97f5-9e42d0bca0c4.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/51166ceb-df8a-4d7a-86bc-aee004b33aa8.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/b0d0f7e4-cad2-4a92-9814-e3f3a4500d6b.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/07b672b7-7685-4a2c-bdea-583ee1f98c80.woff"
            as="font"
            type="font/woff"
            crossOrigin="anonymous"
          />

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>
        <body className="text-black transition-colors duration-500 ease-in-out dark:bg-gray-900 bg-gray-50 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
