import * as React from 'react'
import {NextSeo} from '@skillrecordings/react'
import Navigation, {NavigationProps} from 'components/app/navigation'
import Footer from 'components/app/footer'
import config from 'config'
import isNull from 'lodash/isNull'

export type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  navigation?: React.FC<NavigationProps> | null
  footer?: React.FC<any> | null
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className = 'flex flex-col min-h-screen',
  meta,
  noIndex,
  navigation,
  footer,
}) => {
  const {
    title = config.defaultTitle,
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
        {navigation ? navigation : isNull(navigation) ? null : <Navigation />}
        <div className="flex flex-col justify-center flex-grow">{children}</div>
        {footer ? footer : isNull(footer) ? null : <Footer />}
      </div>
    </>
  )
}

export default Layout
