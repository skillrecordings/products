import React, {FunctionComponent} from 'react'
import {NextSeo, type NextSeoProps} from '@skillrecordings/next-seo'
import {twMerge} from 'tailwind-merge'
import Navigation from './navigation'
import {Inter} from 'next/font/google'
import {Toaster} from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

type LayoutProps = {
  meta?: NextSeoProps & {
    titleAppendSiteName?: boolean
    url?: string
    type?: string
    ogImage?: {url: string; alt: string}
    date?: string
  }
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  children?: any
  withNavigation?: boolean
  navigationProps?: {
    className?: string
  }
  footerProps?: {
    className?: string
  }
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  withNavigation = true,
  navigationProps,
}) => {
  const {
    title,
    description,
    titleAppendSiteName = true,
    url,
    type = 'website',
    ogImage,
    date,
  } = meta || {}

  return (
    <div
      className={`relative ${inter.variable} font-sans antialiased`}
      id="layout"
    >
      <NextSeo
        title={title}
        description={description}
        titleTemplate={
          titleAppendSiteName
            ? `%s | ${process.env.NEXT_PUBLIC_SITE_TITLE}`
            : undefined
        }
        openGraph={{
          title,
          description,
          type,
          url,
          images: ogImage ? [ogImage] : undefined,
          article: {
            publishedTime: date,
          },
        }}
        canonical={url}
        noindex={noIndex}
      />
      <Toaster position="top-center" />
      {withNavigation && <Navigation {...navigationProps} />}
      <div
        className={twMerge(
          'flex h-full min-h-[calc(100svh-4rem)] flex-grow flex-col',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Layout
