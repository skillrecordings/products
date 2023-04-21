import React, {FunctionComponent} from 'react'
import {NextSeo, type NextSeoProps} from '@skillrecordings/next-seo'
import {twMerge} from 'tailwind-merge'
import Navigation from './navigation'
import Footer from './footer'

type LayoutProps = {
  meta?: NextSeoProps & {titleAppendSiteName?: boolean}
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  children?: any
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
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
      <Navigation />
      <div
        className={twMerge(
          'flex h-full min-h-screen flex-grow flex-col',
          className,
        )}
      >
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout
