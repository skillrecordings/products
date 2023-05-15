import React from 'react'
import Layout from 'components/app/layout'
import {Signature} from './confirm'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout
      meta={{title: 'Subscription confirmed'}}
      withFooter={false}
      className="bg-brand-primary-light font-heading text-black"
      navigationProps={{
        className: 'bg-transparent w-full max-w-none pt-10 absolute',
      }}
    >
      <main className="flex flex-grow flex-col items-center justify-center px-5 pb-16 pt-32">
        <Image />
        <div className="flex max-w-lg flex-col items-center text-center font-light">
          <h1 className="py-8 text-4xl font-bold lg:text-5xl">
            You're Confirmed!
          </h1>
          <p className="mx-auto pb-8 font-medium leading-relaxed sm:text-xl">
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
