import * as React from 'react'
import {NextSeo} from 'next-seo'
import Navigation from '../components/navigation'
import Footer from '../components/footer'

export type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  showNavigation?: boolean
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  meta,
  noIndex,
  showNavigation = true,
}) => {
  const {
    title,
    description,
    titleAppendSiteName = false,
    url,
    ogImage,
  } = meta || {}

  console.log(showNavigation)
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
        {showNavigation && <Navigation title={title} />}
        <main className="flex-grow flex flex-col justify-center">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
