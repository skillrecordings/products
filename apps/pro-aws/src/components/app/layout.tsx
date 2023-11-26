import React, {FunctionComponent} from 'react'
import {NextSeo, type NextSeoProps} from '@skillrecordings/next-seo'
import {twMerge} from 'tailwind-merge'
import Navigation from './navigation'
import Footer from './footer'
import {Inter} from 'next/font/google'
import {Toaster} from 'react-hot-toast'
import {patron} from '@/utils/load-fonts'

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
    <div className={`relative ${patron.variable} font-sans`} id="layout">
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
      {withNavigation && (
        <div className="sm:px-5 lg:px-8">
          <Navigation {...navigationProps} />
        </div>
      )}
      <div
        className={twMerge(
          'flex h-full min-h-[calc(100vh-64px)] flex-grow flex-col sm:px-5 lg:px-8',
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
