import * as React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import toast from 'react-hot-toast'

const CheckYourEmail = () => {
  React.useEffect(() => {
    toast('Check your email', {
      icon: '✉️',
    })
  }, [])

  return (
    <Layout
      footer={null}
      meta={{title: `Log in to ${process.env.NEXT_PUBLIC_SITE_TITLE}`}}
    >
      <main className="flex flex-grow flex-col items-center justify-center px-5 pt-5 pb-16 text-white">
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 text-center">
          <h1 className="text-center font-heading text-3xl font-bold leading-9">
            Check your email
          </h1>
          <p className="text-sand-100">
            A login link will been sent to your email! Use it and you&apos;ll be
            able to access your account.
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default CheckYourEmail
