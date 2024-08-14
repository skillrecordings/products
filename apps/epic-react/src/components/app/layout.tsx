import * as React from 'react'
import {NextSeo, type NextSeoProps} from '@skillrecordings/next-seo'
import {twMerge} from 'tailwind-merge'
import cx from 'classnames'
import Navigation from './navigation'
import {Inter} from 'next/font/google'
import toast, {Toaster} from 'react-hot-toast'

import {useFeedback} from '@/components/feedback-widget/feedback-context'
import {useGoldenTicket} from '@skillrecordings/skill-lesson/hooks/use-golden-ticket'

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
    ogImage?: {url: string; alt: string}
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
}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  withNavigation = true,
  navigationProps,
  isNavigationFixed = true,
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

  React.useEffect(() => {
    if (couponData && !validCoupon) {
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
          isNavigationFixed={isNavigationFixed}
        />
      )}
      <div
        className={twMerge(
          cx(
            'flex min-h-[calc(100svh-57px)] flex-grow flex-col sm:min-h-[calc(100svh-61px)]',
            {'mt-[57px] sm:mt-[61px]': isNavigationFixed},
            className,
          ),
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default Layout
