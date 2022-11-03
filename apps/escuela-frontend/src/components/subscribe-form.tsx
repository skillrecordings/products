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
      <div className="absolute left-0 bottom-0 h-[700px] w-full overflow-hidden">
        <div className="absolute top-0 left-0 h-56 w-full" />
      </div>
      <div className="relative flex w-full flex-col items-center justify-center px-5 pt-28 pb-32 sm:pb-48">
        <div className="pb-16 text-center">
          <h2 className="mx-6 mt-12 mb-4 w-[400px] bg-gradient-to-b from-white to-gray-200 bg-clip-text text-center font-heading text-4xl font-extrabold leading-tight text-transparent sm:text-4xl md:!w-full md:text-5xl lg:text-6xl">
            Domina el Universo Front-End
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
        <p className="pt-8 text-center text-base opacity-80">
          Sin spam, cancele en cualquier momento.
        </p>
      </div>
    </section>
  )
}
export default SubscribeForm
