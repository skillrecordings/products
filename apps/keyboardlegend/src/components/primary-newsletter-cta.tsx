import * as React from 'react'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {useRouter} from 'next/router'
import common from '../text/common'
import Button from 'components/button'

export const PrimaryNewsletterCta: React.FC<
  React.PropsWithChildren<unknown>
> = ({children}) => {
  const router = useRouter()
  return (
    <section className="max-w-4xl mx-auto w-full">
      <h1 className="sm:text-4xl text-3xl font-bold text-center">
        {common['primary-newsletter-title']}
      </h1>
      <h2 className="sm:text-2xl text-xl font-light max-w-md mx-auto pt-4 text-center text-brand-pink-500">
        {common['primary-newsletter-byline']}
      </h2>
      <div className="max-w-xs mx-auto w-full py-16">
        <SubscribeToConvertkitForm
          onSuccess={(subscriber: any) => {
            if (subscriber) {
              const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
              router.push(redirectUrl)
            }
          }}
          submitButtonElem={
            <Button>{common['primary-newsletter-button-cta-label']}</Button>
          }
        />
        <div className="text-sm text-gray-500 text-center pt-10">
          No spam, unsubscribe any time.
        </div>
      </div>
    </section>
  )
}
