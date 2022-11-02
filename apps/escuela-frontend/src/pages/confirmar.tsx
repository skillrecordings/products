import React from 'react'
import Layout from 'components/layout'
import config from 'config'

const ConfirmSubscriptionPage = () => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <Image />
        <div className="max-w-screen-sm text-center font-light">
          <p className="sm:text-xl">
            ¡Muchas gracias por registrarte! Hay un último paso.
          </p>
          <h1 className="font-heading py-8 text-4xl font-bold lg:text-5xl">
            Por favor, revisa tu inbox. Te acabamos de enviar un correo.
          </h1>
          <p className="mx-auto pb-8 leading-relaxed sm:text-xl">
            Deberás hacer clic en el enlace de confirmación para recibir más
            correos electrónicos. Si no ves el correo electrónico después de
            unos minutos, es posible que el correo este en tu carpeta de correo
            no deseado, agrega {''}
            <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> a tus
            contactos.
          </p>
          <p className="sm:text-lg">
            Gracias, <br />
            <Signature />
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmSubscriptionPage

export const Signature = () => {
  //TODO: add a signature
  return <>{config.author}</>
}

const Image = () => {
  //TODO: add an image
  return null
}
