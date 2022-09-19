import React from 'react'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'

const SubscribeForm = () => {
  const router = useRouter()
  return (
    <section className="relative">
      <div className="absolute left-0 bottom-0 overflow-hidden w-full h-[700px]">
        <div className="absolute top-0 left-0 w-full h-56" />
      </div>
      <div className="relative flex flex-col items-center justify-center w-full px-5 pt-10 pb-32 sm:pb-48">
        <div className="pb-16 text-center">
          <h2 className="font-heading sm:text-6xl text-[2.5rem] leading-none font-bold">
            Avanza tu Carrera con Entrenamiento de Ingeniería Front-End
            Profesional
          </h2>
          <p className="pt-4 text-xl  sm:text-2xl">
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
        <p className="pt-8 text-base text-center opacity-80">
          I respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}
export default SubscribeForm
