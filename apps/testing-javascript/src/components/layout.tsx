import * as React from 'react'
import {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/next-seo'
import cx from 'classnames'
import toast, {Toaster} from 'react-hot-toast'
import Navigation from './navigation'
import type {LayoutProps} from '@/@types/'
import {useGoldenTicket} from '@skillrecordings/skill-lesson/hooks/use-golden-ticket'

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  noNav,
  navClassName,
}) => {
  const {
    title,
    description,
    titleAppendSiteName = true,
    url,
    type = 'website',
    ogImage,
    date,
  } = meta || {}

  const {RedeemDialogForCoupon, couponData, invalidReason, validCoupon} =
    useGoldenTicket()

  React.useEffect(() => {
    if (couponData && !couponData.isValid && invalidReason) {
      toast.error(invalidReason)
    }
  }, [couponData, invalidReason, validCoupon])

  return (
    <div className="relative bg-white">
      <RedeemDialogForCoupon />
      <Toaster
        position="top-center"
        containerStyle={{background: 'transparent'}}
      />
      <NextSeo
        title={title}
        description={description}
        titleTemplate={
          titleAppendSiteName
            ? `%s | ${process.env.NEXT_PUBLIC_SITE_TITLE}`
            : undefined
        }
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
      {!noNav && <Navigation className={navClassName} />}
      <div
        className={cx(
          'flex min-h-[calc(100vh-100px)] flex-grow flex-col sm:min-h-[calc(100vh-87px)] justify-start',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Layout
