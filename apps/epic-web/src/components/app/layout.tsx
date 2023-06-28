import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/next-seo'
import {Toaster} from 'react-hot-toast'
import Navigation from 'components/app/navigation'
import {twMerge} from 'tailwind-merge'
import {useCtaActive} from 'pages/full-stack-workshop-series-vol-1'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  children?: any
  navigationClassName?: string
  navigationContainerClassName?: string
  navigationSize?: 'sm' | 'md' | 'lg'
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  navigationClassName,
  navigationContainerClassName,
  navigationSize,
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
  const isCtaActive = useCtaActive()

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
      <Navigation
        className={navigationClassName}
        size={navigationSize}
        navigationContainerClassName={navigationContainerClassName}
      />
      <div
        className={twMerge(
          'relative flex h-full flex-grow flex-col',
          className,
        )}
        style={{
          minHeight: isCtaActive ? 'calc(100vh - 112px)' : 'calc(100vh - 80px)',
          paddingTop: isCtaActive ? '112px' : '80px',
        }}
      >
        {children}
      </div>
    </>
  )
}

export default Layout
