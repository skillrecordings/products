import React from 'react'
import Layout from 'components/app/layout'
import {Signature} from './confirmar'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <Image />
        <div className="max-w-lg text-center font-light">
          <h1 className="py-8 text-4xl font-bold lg:text-5xl">
            ¡Has confirmado tu subscripción!
          </h1>
          <p className="mx-auto pb-8 leading-relaxed sm:text-xl">
            Gracias por confirmar tu correo electrónico, ya estás listo para
            recibir correos electrónicos sobre{' '}
            {process.env.NEXT_PUBLIC_SITE_TITLE}.
          </p>
          <Signature />
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmedSubscriptionPage

const Image = () => {
  return null
}
