import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/react'
import Navigation from 'components/navigation'
import Footer from 'components/footer'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
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
        additionalMetaTags={[
          {
            name: 'google-site-verification',
            content: 'NYJ_fuwXe8EEG56oW0-ty0TO5k3MWz_VA9m_vOI-7cw',
          },
        ]}
      />
      <div className={`flex flex-col min-h-screen ${className}`}>
        <Navigation />
        <div className="flex-grow flex flex-col justify-center">{children}</div>
      </div>
      {/* <Footer /> */}
    </>
  )
}

export default Layout
