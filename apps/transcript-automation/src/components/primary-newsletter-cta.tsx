import * as React from 'react'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
import common from '../text/common'

export const PrimaryNewsletterCta: React.FC<
  React.PropsWithChildren<unknown>
> = ({children}) => {
  const router = useRouter()
  return (
    <section
      aria-label="Email course sign-up"
      id="subscribe"
      className="relative flex flex-col items-center justify-center overflow-hidden sm:px-16 px-5 lg:pb-32 sm:pb-24 pb-16 sm:pt-24 pt-10"
    >
      {children ? (
        children
      ) : (
        <>
          <h2 className="max-w-lg font-heading mx-auto -mt-4 sm:text-4xl text-xl leading-none text-center md:text-3xl font-bold sm:mt-0">
            Save time. Create better content. Use robots.
          </h2>
          <h3 className="max-w-md leading-tight pt-6 pb-16 text-lg text-center">
            Descript is <em>so</em> April 2022.
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
      <p className="pt-8 opacity-80 text-sm">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </section>
  )
}
