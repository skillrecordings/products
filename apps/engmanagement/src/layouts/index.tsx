import React, { FunctionComponent } from 'react'
import { NextSeo } from 'next-seo'
import Navigation from 'components/navigation'
import Footer from 'components/footer'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  hideNav?: boolean
}

const Layout: FunctionComponent<LayoutProps> = ({
  children,
  className,
  meta,
  noIndex,
  hideNav = false,
}) => {
  const { title, description, titleAppendSiteName = false, url, ogImage } = meta || {}
  return (
    <>
      <NextSeo
        title={title}
        description={description}
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
        {!hideNav && <Navigation />}
        <main className="flex-grow flex flex-col justify-center">{children}</main>
        {/* <Footer /> */}
      </div>
    </>
  )
}

export default Layout
