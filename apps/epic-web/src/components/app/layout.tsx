import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/next-seo'
import {Toaster} from 'react-hot-toast'
import Navigation from 'components/app/navigation'
import {cn} from '@skillrecordings/ui/utils/cn'
import Footer from './footer'
import GlobalSearchBar from 'search-bar'
import '../../search-bar/cmdk.css'
import {useGlobalBanner} from 'hooks/use-global-banner'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  children?: any
  navigationClassName?: string
  globalBannerClassName?: string
  navigationContainerClassName?: string
  withFooter?: boolean
  enableScrollAnimation?: boolean
  enableGlobalBanner?: boolean
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  navigationClassName,
  globalBannerClassName,
  navigationContainerClassName,
  withFooter = true,
  enableScrollAnimation = true,
  enableGlobalBanner = true,
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
  const {isShowingSiteBanner, bannerHeight} = useGlobalBanner()

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
        navigationContainerClassName={navigationContainerClassName}
        globalBannerClassName={globalBannerClassName}
        enableScrollAnimation={enableScrollAnimation}
        enableGlobalBanner={enableGlobalBanner}
      />
      <div
        id="layout"
        style={{
          marginTop: isShowingSiteBanner ? bannerHeight : '0',
        }}
        className={cn(
          `relative flex h-full min-h-screen flex-grow flex-col pt-[48px] sm:pt-12`,
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
