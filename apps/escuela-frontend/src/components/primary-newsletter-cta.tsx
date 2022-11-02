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
      className="relative flex flex-col items-center justify-center overflow-hidden px-5 pt-10 pb-16 sm:px-16 sm:pb-24 sm:pt-24 lg:pb-32"
    >
      <>
        {children ? (
          children
        ) : (
          <>
            <h2 className="font-heading mx-auto -mt-4 max-w-lg text-center text-3xl font-bold leading-none sm:mt-0 sm:text-4xl md:text-5xl">
              Join the Newsletter
            </h2>
            <h3 className="max-w-md pt-6 pb-16 text-center text-xl leading-tight">
              Learn stuff!
            </h3>
          </>
        )}
      </>
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
