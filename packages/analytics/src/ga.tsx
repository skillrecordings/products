import * as React from 'react'

export const pageview = (url: string) => {
  if (window.gtag && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    })
  }
}

// log specific events happening.
export const event = ({action, params}: {action: string; params: any}) => {
  if (window.gtag && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS) {
    window.gtag('event', action, params)
  }
}

export const GoogleSnippet = () =>
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  ) : null
