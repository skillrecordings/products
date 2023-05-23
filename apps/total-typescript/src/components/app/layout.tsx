import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/next-seo'
import Navigation from '@/components/app/navigation'
import {twMerge} from 'tailwind-merge'
import isNull from 'lodash/isNull'
import {Toaster} from 'react-hot-toast'
import {useRouter} from 'next/router'
import {Survey} from '../../offer/survey'
import {DefaultCoupon} from '@skillrecordings/commerce-server/dist/@types'
import {useFeedback} from '../../feedback-widget/feedback-context'
import Footer from '@/components/app/footer'
import GlobalSearchBar from '@/search-bar'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  defaultCoupon?: DefaultCoupon
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

  const {
    title,
    description,
    titleAppendSiteName = true,
    url = `${process.env.NEXT_PUBLIC_URL}${router.asPath}`,
    type = 'website',
    ogImage = {
      url: `${process.env.NEXT_PUBLIC_URL}/card@2x.png`,
    },
    date,
  } = meta || {}

  return (
    <div className="relative">
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
      <GlobalSearchBar />
      <Toaster position="top-center" />
      {isFeedbackDialogOpen && feedbackComponent}
      {nav ? nav : isNull(nav) ? null : <Navigation />}
      <div
        className={twMerge(
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
