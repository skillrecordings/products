import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/next-seo'
import {Toaster} from 'react-hot-toast'
import cx from 'classnames'
import Navigation from 'components/navigation'
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
    titleAppendSiteName = false,
    url,
    type = 'website',
    ogImage,
    date,
  } = meta || {}

  return (
    <div className="relative">
      <Toaster position="top-center" />
      <NextSeo
        title={title}
        description={description}
        titleTemplate={titleAppendSiteName ? `%s | Pro Tailwind` : undefined}
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
      <div className={cx('flex h-full flex-grow flex-col', className)}>
        {children}
        {/* {footer ? footer : isNull(footer) ? null : <Footer />} */}
      </div>
    </div>
  )
}

export default Layout
