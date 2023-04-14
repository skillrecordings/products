import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/next-seo'
import {Toaster} from 'react-hot-toast'
import Navigation from 'components/app/navigation'
import cx from 'classnames'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  children?: any
  navigationClassName?: string
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  navigationClassName,
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
    <>
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
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fde68a',
            secondary: '#000',
          },
        }}
      />
      <Navigation className={navigationClassName} />
      <div
        className={cx('flex h-full min-h-screen flex-grow flex-col', className)}
      >
        {children}
      </div>
    </>
  )
}

export default Layout
