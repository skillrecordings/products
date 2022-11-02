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
      <div className="relative flex w-full flex-col items-center justify-center px-5 pt-10 pb-32 sm:pb-48">
        <div className="pb-16 text-center">
          <h2 className="font-heading text-[2.5rem] font-bold leading-none sm:text-6xl">
            Avanza tu Carrera con Entrenamiento de Ingeniería Front-End
            Profesional
          </h2>
          <p className="pt-4 text-xl  sm:text-2xl">
            ¡Subscríbete para lecciones exclusivas!
          </p>
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
          Respetamos tu privacidad. Cancela tu suscripción en cualquier momento.
        </p>
      </div>
    </section>
  )
}
export default SubscribeForm
