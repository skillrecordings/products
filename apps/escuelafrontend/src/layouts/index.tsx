import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/react'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className = '',
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
      <div className={`${className}`}>
        <main className="flex flex-col justify-center flex-grow">
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout
