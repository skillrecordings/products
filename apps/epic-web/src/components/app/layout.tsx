import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/next-seo'
import cx from 'classnames'
import Navigation from 'components/app/navigation'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
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
    titleAppendSiteName = true,
    url,
    type = 'website',
    ogImage,
    date,
  } = meta || {}

  return (
    <div className="relative flex lg:flex-row flex-col">
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
      <Navigation />
      <div
        className={cx('flex flex-col flex-grow h-full min-h-screen', className)}
      >
        {children}
      </div>
    </div>
  )
}

export default Layout
