import React, {FunctionComponent} from 'react'
import {NextSeo, type NextSeoProps} from '@skillrecordings/next-seo'
import {twMerge} from 'tailwind-merge'
import Navigation from './navigation'
// import Footer from './footer'

type LayoutProps = {
  meta?: NextSeoProps & {titleAppendSiteName?: boolean}
  noIndex?: boolean
  className?: string
  footer?: React.ReactElement | null
  children?: any
  withNavigation?: boolean
  withFooter?: boolean
  navigationProps?: {
    className?: string
    wrapperClassName?: string
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
  withFooter = true,
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
    <div className="relative">
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
      {withNavigation && <Navigation {...navigationProps} />}
      <div
        className={twMerge(
          'flex h-full min-h-[calc(100vh-80px)] flex-grow flex-col',
          className,
        )}
      >
        {children}
      </div>
      {/* {withFooter && <Footer {...footerProps} />} */}
    </div>
  )
}

export default Layout
