import React, {FunctionComponent} from 'react'
import {NextSeo, type NextSeoProps} from '@skillrecordings/next-seo'
import {twMerge} from 'tailwind-merge'
import Navigation from './navigation'
import Footer from './footer'
import {Inter} from 'next/font/google'
import {Toaster} from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

type LayoutProps = {
  meta?: NextSeoProps & {titleAppendSiteName?: boolean}
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  children?: any
  withNavigation?: boolean
  withFooter?: boolean
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
  withFooter = true,
  navigationProps,
  footerProps,
}) => {
  const {
    title,
    description,
    openGraph,
    titleAppendSiteName = true,
    defaultTitle = process.env.NEXT_PUBLIC_SITE_TITLE,
  } = meta || {}

  const {url} = openGraph || {}

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
        openGraph={openGraph}
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
      {withFooter && <Footer {...footerProps} />}
    </div>
  )
}

export default Layout
