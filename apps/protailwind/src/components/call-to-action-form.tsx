import React from 'react'
import CityScene from 'components/scenes/city'
import Camera from 'components/scenes/city/camera'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'

export const CallToActionForm = () => {
  const router = useRouter()
  return (
    <section className="relative">
      <div className="absolute left-0 bottom-0 overflow-hidden w-full h-[700px]">
        <CityScene camera={<Camera animateOnScroll={false} />} />
        <div className="absolute top-0 left-0 w-full h-56 bg-gradient-to-b from-slate-900 to-slate-900/0" />
      </div>
      <div className="pt-10 sm:pb-48 pb-32 px-5 relative w-full flex flex-col items-center justify-center">
        <div className="text-center pb-16">
          <h2 className="font-heading sm:text-6xl text-[2.5rem] leading-none font-bold text-slate-50">
            Learn to use Tailwind CSS like a pro
          </h2>
          <p className="pt-4 text-indigo-300">
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
        />
        <p className="opacity-80 text-center text-base pt-8">
          I respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}
