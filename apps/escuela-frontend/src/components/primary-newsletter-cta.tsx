import * as React from 'react'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
import common from '../text/common'

export const PrimaryNewsletterCta: React.FC = ({children}) => {
  const router = useRouter()
  return (
    <section
      aria-label="Email course sign-up"
      id="subscribe"
      className="relative flex flex-col items-center justify-center px-5 pt-10 pb-16 overflow-hidden sm:px-16 lg:pb-32 sm:pb-24 sm:pt-24"
    >
      {children ? (
        children
      ) : (
        <>
          <h2 className="max-w-lg mx-auto -mt-4 text-3xl font-bold leading-none text-center font-heading sm:text-4xl md:text-5xl sm:mt-0">
            Join the Newsletter
          </h2>
          <h3 className="max-w-md pt-6 pb-16 text-xl leading-tight text-center">
            Learn stuff!
          </h3>
        </>
      )}
      <SubscribeToConvertkitForm
        onSuccess={(subscriber: any) => {
          if (subscriber) {
            const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
            router.push(redirectUrl)
          }
        }}
        actionLabel={`${common['primary-newsletter-button-cta-label']} →`}
      />
      <p className="pt-8 text-sm opacity-80">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </section>
  )
}
