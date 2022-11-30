import React from 'react'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'

const SubscribeForm = () => {
  const router = useRouter()
  return (
    <section className="bg-brand-purple sm:py-[10vh] py-16 px-5">
      <div className="max-w-screen-lg mx-auto">
        <div className="text-center space-y-7 pb-12">
          <h3 className="lg:text-6xl sm:text-5xl text-4xl leading-none tracking-tight font-bold">
            Become proficient with backend development today!
          </h3>
          <p className="text-xl">
            Sign up for exclusive content and early-release lessons.
          </p>
        </div>
        <SubscribeToConvertkitForm
          onSuccess={(subscriber: any) => {
            if (subscriber) {
              const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
              router.push(redirectUrl)
            }
          }}
          actionLabel="Sign Up Today"
        />
        <p className="text-center pt-12">
          I respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}
export default SubscribeForm
