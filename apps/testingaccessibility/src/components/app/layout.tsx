import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import cx from 'classnames'
import Navigation from './navigation'
import isNull from 'lodash/isNull'
import {Toaster} from 'react-hot-toast'
import {SkipNavContent, SkipNavLink} from '@reach/skip-nav'
import config from 'config'

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
    title = config.defaultTitle,
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
      <SkipNavContent
        className={cx('flex flex-col flex-grow bg-white h-full', className)}
      >
        {children}
      </SkipNavContent>
    </>
  )
}

export default Layout
