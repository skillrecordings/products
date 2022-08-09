import Layout from 'components/app/layout'
import * as React from 'react'

const CheckYourEmail = () => {
  return (
    <Layout
      meta={{title: 'Login to Engineering Management'}}
      className="flex flex-col h-full"
    >
      <div
        className="min-h-screen w-full mx-auto md:pb-32 py-16 flex flex-col items-center justify-center p-5"
        style={{
          backgroundImage: "url('/assets/pattern-topography.svg')",
        }}
      >
        <div className="sm:mx-auto rounded-lg max-w-lg text-center">
          <h1 className="text-center sm:text-6xl leading-9 font-extrabold pb-4 font-din uppercase">
            Check your email
          </h1>
          <p className="font-brandon sm:text-xl tetx-lg">
            If you bought the book, a login link will been sent to your email!
            Use it and you&apos;ll be able to access the content.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default CheckYourEmail
