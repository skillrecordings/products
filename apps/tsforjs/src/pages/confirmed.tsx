import React from 'react'
import Layout from 'components/layout'
import {Signature} from './confirm'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center flex-col px-5 bg-black h-screen text-white">
        <Image />
        <div className="max-w-lg text-center font-light">
          <h1 className="font-bold lg:text-5xl text-4xl py-8 font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
            You're Confirmed!✨
          </h1>
          <p className="sm:text-xl leading-relaxed mx-auto pb-8">
            Thanks for confirming your email address — you're all set to receive{' '}
            emails from me about {process.env.NEXT_PUBLIC_SITE_TITLE}.
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
