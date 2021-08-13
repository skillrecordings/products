import * as React from 'react'
import {NextSeo} from 'next-seo'
import Navigation from '../components/navigation'
import Footer from '../components/footer'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  meta,
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
      <div className={`p-5 flex flex-col min-h-screen ${className}`}>
        <Navigation title={title} />
        <div className="flex-grow flex flex-col justify-center">{children}</div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
