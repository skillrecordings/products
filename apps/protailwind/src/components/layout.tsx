import React, {FunctionComponent} from 'react'
import {NextSeo} from 'next-seo'
import cx from 'classnames'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  children?: any
}

const Layout: FunctionComponent<LayoutProps> = ({
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
      {/* {nav ? nav : isNull(nav) ? null : <Navigation />} */}
      <div
        className={cx(
          'flex flex-col flex-grow h-full sm:min-h-[calc(100vh-64px)] min-h-[calc(100vh-56px)]',
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
