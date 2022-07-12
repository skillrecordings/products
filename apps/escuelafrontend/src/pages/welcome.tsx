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
        Welcome {session.user && session.user.email} <br />
      </>
    )
  }
  return (
    <>
      <div className="max-w-md text-center rounded-lg sm:mx-auto">
        <h1 className="pb-4 text-3xl font-extrabold leading-9 text-center">
          Check your email
        </h1>

        <p>
          A login link will been sent to your email! Use it and you&apos;ll be
          able to access the content.
        </p>
      </div>
    </>
  )
}

export default CheckYourEmail
