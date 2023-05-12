import * as React from 'react'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit-react-ui'
import {useRouter} from 'next/router'
import common from '../text/common'
import Balancer from 'react-wrap-balancer'

export const PrimaryNewsletterCta: React.FC<
  React.PropsWithChildren<{id?: string}>
> = ({children, id = 'primary-newsletter-cta'}) => {
  const router = useRouter()
  return (
    <section
      aria-label="Subscribe"
      id={id}
      className="text-center flex flex-col items-center justify-center relative z-10"
    >
      {children ? (
        children
      ) : (
        <>
          <h2 className="sm:text-5xl text-3xl font-bold">
            <Balancer>Find out What's Next for Colt Steele</Balancer>
          </h2>
          <h3 className="text-xl pt-8 max-w-md w-full mb-16">
            <Balancer>
              Want to be the first to know when the next course is released?
              Sign up below.
            </Balancer>
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
        actionLabel={common['primary-newsletter-button-cta-label']}
      />
      <p className="mt-8 opacity-80 text-sm bg-brand-bone px-1 py-0.5">
        I respect your privacy. Unsubscribe at any time.
      </p>
    </section>
  )
}
