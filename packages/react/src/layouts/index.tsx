import * as React from 'react'
import {NextSeo} from 'next-seo'
import DefaultNavigation, {NavigationProps} from '../components/navigation'
import DefaultFooter, {FooterProps} from '../components/footer'

export type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  showNavigation?: boolean
  Navigation?: React.FC<NavigationProps>
  Footer?: React.FC<FooterProps>
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
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
      <div className={`p-5 flex flex-col min-h-screen ${className}`}>
        <Navigation title={title} />
        <div className="flex-grow flex flex-col justify-center">{children}</div>
        {Footer && <Footer />}
      </div>
    </>
  )
}

export default Layout
