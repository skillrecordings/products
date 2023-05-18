'use client'

import React, {FunctionComponent} from 'react'
import {NextSeo} from '@skillrecordings/next-seo'
import Navigation from 'components/app/navigation'
import cx from 'classnames'
import isNull from 'lodash/isNull'
import {Toaster} from 'react-hot-toast'
import {useRouter, usePathname} from 'next/navigation'
import {Survey} from '../../offer/survey'
import {DefaultCoupon} from '@skillrecordings/commerce-server/dist/@types'
import {useFeedback} from '../../feedback-widget/feedback-context'
import Footer from 'components/app/footer'
import GlobalSearchBar from 'search-bar'

type ClientComponentLayoutProps = {
  children: React.ReactNode
}

export const ClientComponentLayout: FunctionComponent<
  ClientComponentLayoutProps
> = ({children}) => {
  const {isFeedbackDialogOpen, feedbackComponent} = useFeedback()

  return (
    <>
      <GlobalSearchBar />
      <Toaster position="top-center" />
      {isFeedbackDialogOpen && feedbackComponent}

      {children}
      <Survey />
    </>
  )
}
