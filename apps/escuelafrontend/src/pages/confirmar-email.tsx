import * as React from 'react'
import {useSession} from 'next-auth/react'

const CheckYourEmail = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center justify-center flex-grow w-full p-5 py-16 mx-auto md:pb-32">
        <Auth />
      </div>
    </div>
  )
}

function Auth() {
  const {data: session} = useSession()
  if (session) {
    return (
      <>
        Hola {session.user && session.user.email} <br />
      </>
    )
  }
  return (
    <>
      <div className="max-w-md text-center rounded-lg sm:mx-auto">
        <h1 className="pb-4 text-3xl font-extrabold leading-9 text-center">
          Revisa tu inbox!
        </h1>

        <p>
          Te acabamos de enviar un correo. Deberás hacer clic en el enlace para
          iniciar sesión.
        </p>
      </div>
    </>
  )
}

export default CheckYourEmail
