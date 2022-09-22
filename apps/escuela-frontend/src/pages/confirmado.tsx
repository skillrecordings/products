import React from 'react'
import Layout from 'components/layout'
import {Signature} from './confirmar'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center flex-col px-5">
        <Image />
        <div className="max-w-lg text-center font-light">
          <h1 className="font-bold lg:text-5xl text-4xl py-8 font-heading">
            ¡Has confirmado tu subscripción!
          </h1>
          <p className="sm:text-xl leading-relaxed mx-auto pb-8">
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
