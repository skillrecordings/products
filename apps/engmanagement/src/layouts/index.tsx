import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/react'
import Navigation from 'components/app/navigation'
import cx from 'classnames'
import Footer from 'components/footer'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  hideNav?: boolean
}

const Layout: FunctionComponent<
  React.PropsWithChildren<React.PropsWithChildren<LayoutProps>>
> = ({children, className, meta, noIndex, hideNav = false}) => {
  const {
    title,
    description,
    titleAppendSiteName = false,
    url,
    ogImage,
    type,
    tags,
    author,
    published,
  } = meta || {}
  return (
    <>
      <NextSeo
        title={title}
        description={description}
        titleTemplate={titleAppendSiteName ? undefined : '%s'}
        openGraph={{
          title,
          description,
          url,
          images: ogImage ? [ogImage] : undefined,
          type,
          article: {
            tags: [tags],
            authors: [author?.name],
            publishedTime: published,
          },
        }}
        canonical={url}
        noindex={noIndex}
      />
      <div className={cx('flex flex-col min-h-screen', className)}>
        {!hideNav && <Navigation />}
        <main className="flex-grow flex flex-col justify-center">
          {children}
        </main>
        {/* <Footer /> */}
      </div>
    </>
  )
}

export default Layout
