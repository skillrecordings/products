import React from 'react'
import Layout from 'components/layout'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout>
      <main className="flex-grow flex items-center justify-center flex-col">
        <div className="max-w-lg text-center font-light">
          <h1 className="font-bold lg:text-5xl sm:text-4xl text-3xl py-8 font-heading">
            You're Confirmed!
          </h1>
          <p className="sm:text-xl opacity-80 leading-relaxed mx-auto pb-8">
            Thanks for confirming your email address– you're all set to receive{' '}
            emails from me about Pro Tailwind.
          </p>
          <p className="sm:text-lg opacity-80">— Simon</p>
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmedSubscriptionPage
