import * as React from 'react'
import Image from 'next/image'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'

export const PrimaryNewsletterCta: React.FC = ({children}) => {
  const router = useRouter()
  return (
    <section
      aria-label="Email course sign-up"
      id="subscribe"
      className="relative flex flex-col items-center justify-center overflow-hidden text-white bg-noise bg-green-700 sm:px-16 px-5 lg:pb-32 sm:pb-24 pb-16 sm:pt-24 pt-10"
    >
      <div className="flex flex-col items-center mb-8">
        <Image
          aria-hidden="true"
          src={require('../../public/assets/email@2x.png')}
          placeholder="blur"
          priority
          alt=""
          width={300}
          height={180}
          quality={100}
        />
      </div>
      {children ? (
        children
      ) : (
        <>
          <h2 className="max-w-lg font-heading mx-auto -mt-4 sm:text-4xl text-3xl leading-none text-center md:text-5xl font-bold sm:mt-0">
            Join my exclusive, free{' '}
            <span className="whitespace-nowrap">6-part</span> email course
          </h2>
          <h3 className="max-w-md leading-tight pt-6 pb-16 text-xl text-center text-orange-200">
            And learn more about building and testing accessible web
            applications.
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
        actionLabel="Start Testing Accessibility →"
      />
      <p className="pt-8 opacity-80 text-sm">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </section>
  )
}
