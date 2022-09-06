import React from 'react'
import Layout from '~/components/app/layout'
import {Signature} from './confirm'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center flex-col px-5">
        <div className="max-w-lg text-center font-light">
          <h1 className="font-bold lg:text-5xl text-4xl py-8 font-heading">
            You're Confirmed!
          </h1>
          <p className="sm:text-xl leading-relaxed mx-auto pb-8">
            Thanks for confirming your email address — you're all set to receive{' '}
            emails from me about Epic Web Dev.
          </p>
          <Signature />
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmedSubscriptionPage
