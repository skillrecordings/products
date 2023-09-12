import React, {FunctionComponent} from 'react'
import {NextSeo, type NextSeoProps} from '@skillrecordings/next-seo'
import {twMerge} from 'tailwind-merge'
import Navigation, {NavigationProps} from './navigation'
import Footer from './footer'
import {Toaster} from 'react-hot-toast'
import {maisonNeue, maisonNeueMono} from '@/utils/load-fonts'
import GlobalSearchBar from '@/search-bar'
import {cn} from '@skillrecordings/ui/utils/cn'

type LayoutProps = {
  meta?: NextSeoProps & {titleAppendSiteName?: boolean}
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  children?: any
  withNavigation?: boolean
  withFooter?: boolean
  navigationProps?: NavigationProps
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
  withFooter = false,
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
      className={`relative ${maisonNeue.variable} ${maisonNeueMono.variable} font-sans`}
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
      <GlobalSearchBar />
      <Toaster position="top-center" />
      {withNavigation && <Navigation {...navigationProps} />}
      <div
        className={cn(
          'flex h-full min-h-[calc(100vh-68px)] flex-grow flex-col',
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
