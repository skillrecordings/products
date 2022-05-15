import Layout from 'components/app/layout'
import * as React from 'react'

const CheckYourEmail = () => {
  return (
    <Layout
      meta={{title: 'Login to Engineering Management'}}
      className="flex flex-col h-full sm:min-h-[calc(100vh-64px)] min-h-[calc(100vh-56px)]"
    >
      <div
        className="flex-grow w-full mx-auto md:pb-32 py-16 flex flex-col items-center justify-center p-5"
        style={{
          backgroundImage: "url('/assets/pattern-topography.svg')",
        }}
      >
        <div className="sm:mx-auto rounded-lg max-w-md text-center">
          <h1 className="text-center text-3xl leading-9 font-extrabold pb-4">
            Check your email
          </h1>

          <p>
            If you bought the book, a login link will been sent to your email!
            Use it and you&apos;ll be able to access the content.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default CheckYourEmail
