import React, {FunctionComponent} from 'react'
import {SkipNavContent, SkipNavLink} from '@reach/skip-nav'
import {useNavState} from '../../hooks/use-nav-state'
import type {
  DefaultCoupon,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {useFeedback} from 'context/feedback-context'
import {Toaster} from 'react-hot-toast'
import {NextSeo} from '@skillrecordings/react'
import SaleBanner from 'components/sale-banner'
import Navigation from './navigation'
import isNull from 'lodash/isNull'
import Footer from './footer'
import config from 'config'
import cx from 'classnames'

type LayoutProps = {
  meta?: any
  noIndex?: boolean
  className?: string
  nav?: React.ReactElement | null
  footer?: React.ReactElement | null
  skipNavContent?: any
  products?: SanityProduct[]
  defaultCoupon?: DefaultCoupon
}

const Layout: FunctionComponent<React.PropsWithChildren<LayoutProps>> = ({
  children,
  className,
  meta,
  noIndex,
  nav,
  footer,
  skipNavContent = <SkipNavContent />,
  defaultCoupon,
  products,
}) => {
  const {
    title = config.defaultTitle,
    description,
    titleAppendSiteName = false,
    url,
    type = 'website',
    ogImage,
    date,
  } = meta || {}
  const {isSignedIn} = useNavState()
  const {isFeedbackDialogOpen, feedbackComponent} = useFeedback()
  return (
    <div className="relative">
      <Toaster position="top-center" />
      {isFeedbackDialogOpen && feedbackComponent}
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
      <header aria-label="Global">
        <SkipNavLink className="z-50">
          Skip navigation and go to content
        </SkipNavLink>
        {defaultCoupon && <SaleBanner defaultCoupon={defaultCoupon} />}
        {nav ? nav : isNull(nav) ? null : <Navigation />}
        {skipNavContent}
      </header>
      <div
        className={cx(
          'flex flex-col flex-grow h-full sm:min-h-[calc(100vh-64px)] min-h-[calc(100vh-56px)]',
          className,
        )}
      >
        {children}
        {footer ? footer : isNull(footer) ? null : <Footer />}
      </div>
    </div>
  )
}

export default Layout
