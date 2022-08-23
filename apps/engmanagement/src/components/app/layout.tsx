import React, {FunctionComponent} from 'react'
import {useSession} from 'next-auth/react'
import {Toaster} from 'react-hot-toast'
import {NextSeo} from '@skillrecordings/next-seo'
import config from 'config'
import {DefaultCoupon} from '@skillrecordings/commerce-server/dist/@types'
import Navigation from 'components/navigation'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  defaultCoupon?: DefaultCoupon
}

const Layout: FunctionComponent<
  React.PropsWithChildren<React.PropsWithChildren<LayoutProps>>
> = ({children, className, meta, noIndex, nav = true, footer}) => {
  const {
    title = config.defaultTitle,
    description,
    titleAppendSiteName = false,
    url,
    type = 'website',
    ogImage,
    date,
  } = meta || {}
  const {data: sessionData} = useSession()
  return (
    <div className="relative">
      <Toaster position="top-center" />
      <NextSeo
        title={title}
        description={description}
        titleTemplate={titleAppendSiteName ? undefined : '%s'}
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
      {nav && <Navigation />}
      {children}
    </div>
  )
}

export default Layout
