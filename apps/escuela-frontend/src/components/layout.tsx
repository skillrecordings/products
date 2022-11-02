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
  nav,
  footer,
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
    <div className="relative">
      <Toaster position="top-center" />
      <NextSeo
        title={title}
        description={description}
        titleTemplate={
          titleAppendSiteName ? `%s | Escuela Frontend` : undefined
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
      {nav && <Navigation />}
      <div
        className={cx(
          'flex h-full min-h-[calc(100vh-56px)] flex-grow flex-col sm:min-h-[calc(100vh-64px)]',
          className,
        )}
      >
        {children}
        {/* {footer ? footer : isNull(footer) ? null : <Footer />} */}
      </div>
    </div>
  )
}

export default Layout
