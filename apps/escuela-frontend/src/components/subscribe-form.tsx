import React from 'react'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
import Image from 'next/image'

const NewsletterSubscribeForm = () => {
  const router = useRouter()
  return (
    <section
      id="primary-newsletter-cta"
      className="relative flex flex-col items-center justify-center bg-gradient-to-t from-gray-900/95 via-gray-900 to-gray-900 py-32 px-5 text-white"
    >
      <div className="relative flex w-full flex-col items-center justify-center">
        <div className="max-w-3xl pb-16 text-center">
          <h2 className="font-heading text-4xl font-bold leading-tight sm:text-5xl sm:leading-tight">
            Power-up your team workflow with Escuela Frontend
          </h2>
          <p className="pt-6 text-xl text-gray-100">
            Sign up for exclusive early-release lessons!
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
          submitButtonElem={<SubmitButton />}
        />
        <p className="pt-8 text-center text-base opacity-80">
          I respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}

export default NewsletterSubscribeForm

const SubmitButton: React.FC<any> = (props) => {
  const {isLoading} = props
  return (
    <div className="group relative flex w-full flex-col items-center">
      <div className="pointer-events-none z-20 flex w-24 translate-y-5 items-center justify-center"></div>
      <button data-sr-button="" className="z-10">
        {isLoading ? <Loader /> : 'Sign Up Today'}
      </button>
      <div className="pointer-events-none z-20 hidden w-20 -translate-y-3 items-center justify-center group-hover:flex"></div>
      <div className="pointer-events-none z-0 flex w-20 -translate-y-3 items-center justify-center group-hover:hidden"></div>
    </div>
  )
}

export const Loader = () => {
  return (
    <>
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
      >
        <title>dots-anim-3</title>
        <g fill="currentColor">
          <g className="nc-loop-dots-3-48-icon-f">
            <circle cx="6" cy="24" fill="currentColor" r="5"></circle>
            <circle cx="24" cy="24" r="5"></circle>
            <circle cx="42" cy="24" fill="currentColor" r="5"></circle>
          </g>
          <style>{`.nc-loop-dots-3-48-icon-f>*{--animation-duration:0.8s;transform-origin:50% 50%;animation:nc-loop-dots-3-anim var(--animation-duration) infinite}.nc-loop-dots-3-48-icon-f>:nth-child(2){animation-delay:.1s}.nc-loop-dots-3-48-icon-f>:nth-child(3){animation-delay:.2s}@keyframes nc-loop-dots-3-anim{0%,100%,60%{transform:translateY(0)}30%{transform:translateY(20%)}}`}</style>
        </g>
      </svg>
      <span className="sr-only">Loading</span>
    </>
  )
}
