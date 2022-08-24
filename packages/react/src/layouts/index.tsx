import * as React from 'react'
import DefaultNavigation, {NavigationProps} from '../components/navigation'
import DefaultFooter, {FooterProps} from '../components/footer'
import {NextSeo} from '@skillrecordings/next-seo'

export type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  showNavigation?: boolean
  Navigation?: React.FC<React.PropsWithChildren<NavigationProps>>
  Footer?: React.FC<React.PropsWithChildren<FooterProps>>
}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className = 'p-5 flex flex-col min-h-screen',
  meta,
  noIndex,
  showNavigation = true,
  Navigation = DefaultNavigation,
  Footer = DefaultFooter,
}) => {
  const {
    title,
    description,
    titleAppendSiteName = false,
    url,
    ogImage,
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
        }}
        canonical={url}
        noindex={noIndex}
      />
      <div className={className}>
        <Navigation title={title} />
        <div className="flex-grow flex flex-col justify-center">{children}</div>
        {Footer && <Footer />}
      </div>
    </>
  )
}

export default Layout
