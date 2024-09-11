import * as React from 'react'
import {NextSeo, type NextSeoProps} from '@skillrecordings/next-seo'
import {twMerge} from 'tailwind-merge'
import cx from 'classnames'
import Navigation from './navigation'
import {Inter} from 'next/font/google'
import toast, {Toaster} from 'react-hot-toast'

import {useFeedback} from '@/feedback-widget/feedback-context'
import {useGoldenTicket} from '@skillrecordings/skill-lesson/hooks/use-golden-ticket'
import {cn} from '@skillrecordings/ui/utils/cn'
import {useGlobalBanner} from '@/hooks/use-global-banner'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '600', '800'],
})

type LayoutProps = {
  meta?: NextSeoProps & {
    titleAppendSiteName?: boolean
    url?: string
    type?: string
    ogImage?: {url: string; alt?: string}
    date?: string
  }
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  children?: any
  withNavigation?: boolean
  navigationProps?: {
    className?: string
    navChildren: React.ReactNode
  }
  isNavigationFixed?: boolean
  footerProps?: {
    className?: string
  }
  navigationClassName?: string
}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  withNavigation = true,
  navigationProps,
  isNavigationFixed = true,
  navigationClassName,
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
  const {isFeedbackDialogOpen, feedbackComponent} = useFeedback()
  const {RedeemDialogForCoupon, couponData, invalidReason, validCoupon} =
    useGoldenTicket()
  const {isShowingSiteBanner, bannerHeight} = useGlobalBanner()
  React.useEffect(() => {
    if (couponData && !couponData.isValid && invalidReason) {
      toast.error(invalidReason)
    }
  }, [couponData, invalidReason, validCoupon])

  return (
    <div
      className={`relative ${inter.variable} font-sans text-text antialiased`}
      id="layout"
    >
      <NextSeo
        title={title}
        description={description}
        titleTemplate={
          titleAppendSiteName
            ? `%s | ${process.env.NEXT_PUBLIC_SITE_TITLE} by ${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
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
      <Toaster position="top-center" />
      <RedeemDialogForCoupon />
      {isFeedbackDialogOpen && feedbackComponent}
      {withNavigation && (
        <Navigation
          {...navigationProps}
          className={navigationClassName}
          isNavigationFixed={isNavigationFixed}
        />
      )}
      <div
        id="layout"
        style={{
          marginTop: isShowingSiteBanner ? bannerHeight : '0',
        }}
        className={cn(
          `relative flex h-full min-h-screen flex-grow flex-col pt-[48px] sm:pt-12`,
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Layout
