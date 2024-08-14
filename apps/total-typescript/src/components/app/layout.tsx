import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/next-seo'
import Navigation from '@/components/app/navigation'
import isNull from 'lodash/isNull'
import toast, {Toaster} from 'react-hot-toast'
import {useRouter} from 'next/router'
import {Survey} from '../../offer/survey'
import {useFeedback} from '../../feedback-widget/feedback-context'
import Footer from '@/components/app/footer'
import GlobalSearchBar from '@/search-bar'
import {cn} from '@skillrecordings/ui/utils/cn'
import {larsseit, magnatHead, magnatText} from '@/utils/load-fonts'
import {useGoldenTicket} from '@skillrecordings/skill-lesson/hooks/use-golden-ticket'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  children?: any
}

const Layout: FunctionComponent<LayoutProps> = ({
  children,
  className,
  meta,
  noIndex,
  nav,
  footer,
}) => {
  const router = useRouter()
  const {isFeedbackDialogOpen, feedbackComponent} = useFeedback()

  const {RedeemDialogForCoupon, couponData, invalidReason, validCoupon} =
    useGoldenTicket()

  React.useEffect(() => {
    if (couponData && !couponData.isValid && invalidReason) {
      toast.error(invalidReason)
    }
  }, [couponData, invalidReason, validCoupon])

  const {
    title,
    description,
    defaultTitle = process.env.NEXT_PUBLIC_SITE_TITLE,
    titleAppendSiteName = true,
    url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`,
    type = 'website',
    ogImage = {
      url: `${process.env.NEXT_PUBLIC_URL}/api/og/og-root`,
    },
    keywords,
    date,
  } = meta || {}

  return (
    <div
      id="layout"
      className={`relative font-sans ${larsseit.variable} ${magnatHead.variable} ${magnatText.variable}`}
    >
      <NextSeo
        title={title}
        defaultTitle={defaultTitle}
        description={description}
        titleTemplate={
          titleAppendSiteName
            ? `%s | ${process.env.NEXT_PUBLIC_SITE_TITLE}`
            : undefined
        }
        additionalMetaTags={[
          {
            property: 'keywords',
            content: keywords || process.env.NEXT_PUBLIC_SEO_KEYWORDS,
          },
        ]}
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
      <GlobalSearchBar />
      <RedeemDialogForCoupon />
      <Toaster position="top-center" />
      {isFeedbackDialogOpen && feedbackComponent}
      {nav ? nav : isNull(nav) ? null : <Navigation />}
      <div
        className={cn(
          'flex h-full min-h-screen flex-grow flex-col',

          className,
        )}
      >
        {children}
      </div>
      {footer ? footer : isNull(footer) ? null : <Footer />}
      <Survey />
    </div>
  )
}

export default Layout
