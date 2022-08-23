import React, {FunctionComponent} from 'react'
import Navigation from 'components/navigation'
import Footer from 'components/footer'
import {NextSeo} from '@skillrecordings/next-seo'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  noFooter?: boolean
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noFooter = false,
  noIndex,
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
      <div className={`flex flex-col min-h-screen ${className}`}>
        <Navigation />
        <main className="flex-grow flex flex-col justify-center">
          {children}
        </main>
        {!noFooter && <Footer />}
      </div>
    </>
  )
}

export default Layout
