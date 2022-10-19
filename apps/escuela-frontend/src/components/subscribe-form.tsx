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
      <div className="relative flex flex-col items-center justify-center w-full px-5 pt-28 pb-32 sm:pb-48">
        <div className="pb-16 text-center">
          <h2 className="md:max-w-screen-md lg:text-4xl md:text-3xl sm:text-2xl text-[2rem] font-heading font-bold leading-tight max-w-lg">
            Acelera tu carrera con entrenamiento de Ingeniería Front-End
          </h2>
        </div>

        <SubscribeToConvertkitForm
          onSuccess={(subscriber: any) => {
            if (subscriber) {
              const redirectUrl = redirectUrlBuilder(subscriber, '/confirmar')
              router.push(redirectUrl)
            }
          }}
          actionLabel="Subscríbete"
        />
        <p className="pt-8 text-base text-center opacity-80">
          Sin spam, cancele en cualquier momento.
        </p>
      </div>
    </section>
  )
}
export default SubscribeForm
