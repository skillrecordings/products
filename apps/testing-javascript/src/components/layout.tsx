import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/next-seo'
import cx from 'classnames'
import {Toaster} from 'react-hot-toast'
import Navigation from './navigation'
import type {LayoutProps} from '@types'

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  noNav,
  navClassName,
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
    <div className="relative flex flex-col min-h-screen">
      <Toaster position="top-center" />
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
      {!noNav && <Navigation className={navClassName} />}
      <div className={cx('flex flex-col flex-grow', className)}>{children}</div>
    </div>
  )
}

export default Layout
