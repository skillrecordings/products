import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/next-seo'
import {Toaster} from 'react-hot-toast'
import Navigation from 'components/app/navigation'
import {useWorkshopCta} from 'pages/full-stack-workshop-series-vol-1'
import {cn} from '@skillrecordings/ui/utils/cn'
import Footer from './footer'
import GlobalSearchBar from 'search-bar'
import '../../search-bar/cmdk.css'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  children?: any
  navigationClassName?: string
  navigationContainerClassName?: string
  navigationSize?: 'sm' | 'md' | 'lg'
  withFooter?: boolean
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  navigationClassName,
  navigationContainerClassName,
  navigationSize,
  withFooter = true,
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
  const isCtaActive = useWorkshopCta()

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
      <GlobalSearchBar />
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
        id="layout"
        className={cn(
          `relative flex h-full flex-grow flex-col`,
          {
            'min-h-[calc(100vh-112px)] pt-[112px]': isCtaActive,
            'min-h-[calc(100vh-48px)] pt-[48px] sm:min-h-[calc(100vh-100px)] sm:pt-[80px]':
              !isCtaActive,
          },
          className,
        )}
      >
        {children}
      </div>
      {withFooter ? <Footer /> : null}
    </>
  )
}

export default Layout
