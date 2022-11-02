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
    <section className="py-32 bg-blue-600 text-white relative flex flex-col items-center justify-center px-5">
      <div className="w-5 h-5 rotate-45 bg-gray-50 top-0 absolute -translate-y-3 rounded-sm" />
      <div className="relative w-full flex flex-col items-center justify-center">
        <div className="text-center pb-16 max-w-3xl">
          <h2 className="font-heading sm:text-5xl text-4xl font-black sm:leading-tight leading-tight">
            Power-up your team workflow with Tailwind CSS
          </h2>
          <p className="pt-6 text-xl text-blue-100">
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
        <p className="opacity-80 text-center text-base pt-8">
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
    <div className="group relative flex flex-col items-center w-full">
      <div className="z-20 flex items-center justify-center w-24 translate-y-5 pointer-events-none">
        <Image
          src={require('../../public/assets/corgi-head.svg')}
          aria-hidden="true"
          alt=""
          loading="eager"
        />
      </div>
      <button data-sr-button="" className="z-10">
        {isLoading ? <Loader /> : 'Sign Up Today'}
      </button>
      <div className="hidden z-20 group-hover:flex items-center justify-center w-20 -translate-y-3 pointer-events-none">
        <Image
          src={require('../../public/assets/corgi-legs-up-1.svg')}
          aria-hidden="true"
          alt=""
          loading="eager"
        />
      </div>
      <div className="z-0 flex group-hover:hidden items-center justify-center w-20 -translate-y-3 pointer-events-none">
        <Image
          src={require('../../public/assets/corgi-legs-down-1.svg')}
          aria-hidden="true"
          alt=""
          loading="eager"
        />
      </div>
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
