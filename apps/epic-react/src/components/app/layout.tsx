import * as React from 'react'
import {NextSeo, type NextSeoProps} from '@skillrecordings/next-seo'
import Navigation from './navigation'
import {Inter} from 'next/font/google'
import toast, {Toaster} from 'react-hot-toast'

import {useFeedback} from '@/feedback-widget/feedback-context'
import {useGoldenTicket} from '@skillrecordings/skill-lesson/hooks/use-golden-ticket'
import {cn} from '@skillrecordings/ui/utils/cn'
import {useGlobalBanner} from '@/hooks/use-global-banner'
import Footer from './footer'
import config from '@/config'
import {useTheme} from 'next-themes'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
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
  withFooter?: boolean
}

const Layout: React.FC<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  withNavigation = true,
  withFooter = true,
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

  const {theme} = useTheme()

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
        additionalMetaTags={[
          ...(config.additionalMetaTags?.filter(
            (meta) => meta.property !== 'theme-color',
          ) || []),
          {
            name: 'theme-color',
            content: theme === 'light' ? '#ffffff' : '#0f172a',
          },
        ]}
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
          `relative flex h-full min-h-screen flex-grow flex-col`,
          {
            'pt-[48px] sm:pt-12': withNavigation,
          },
          className,
        )}
      >
        {children}
      </div>
      {withFooter ? <Footer /> : null}
    </div>
  )
}

export default Layout
