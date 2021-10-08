import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import Navigation from './navigation'
import isNull from 'lodash/isNull'
import {Toaster} from 'react-hot-toast'
import {SkipNavContent, SkipNavLink} from '@reach/skip-nav'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
}

const Layout: FunctionComponent<LayoutProps> = ({
  children,
  className,
  meta,
  noIndex,
  nav,
}) => {
  const {
    title,
    description,
    titleAppendSiteName = false,
    url,
    ogImage,
  } = meta || {}

  return (
    <>
      <Toaster position="bottom-center" />
      <NextSeo
        title={title}
        description={description}
        titleTemplate={titleAppendSiteName ? undefined : '%s'}
        openGraph={{
          title,
          description,
          url,
          images: ogImage ? [ogImage] : undefined,
        }}
        canonical={url}
        noindex={noIndex}
      />
      <SkipNavLink>Skip navigation and go to content</SkipNavLink>
      {nav ? nav : isNull(nav) ? null : <Navigation />}
      <div className={`flex flex-col min-h-screen bg-white ${className}`}>
        <SkipNavContent>
          <div className="flex-grow flex flex-col justify-center">
            {children}
          </div>
        </SkipNavContent>
      </div>
    </>
  )
}

export default Layout
