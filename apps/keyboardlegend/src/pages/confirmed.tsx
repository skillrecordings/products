import React from 'react'
import Layout from 'components/app/layout'
import {Confirmed, Signature} from 'components/images'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center flex-col px-5 py-32">
        <Image />
        <div className="max-w-lg text-center font-light">
          <h1 className="font-bold lg:text-5xl text-4xl py-8 font-heading">
            You're Confirmed!
          </h1>
          <p className="sm:text-xl leading-relaxed mx-auto pb-8">
            Thanks for confirming your email address — you're all set to receive{' '}
            emails from me about {process.env.NEXT_PUBLIC_SITE_TITLE}.
          </p>
          <Signature className="w-48 mx-auto pt-2" />
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmedSubscriptionPage

const Image = () => {
  return (
    <div className="w-16 mx-auto pb-4">
      <Confirmed />
    </div>
  )
}
