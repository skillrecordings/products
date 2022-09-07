import React from 'react'
import Layout from 'components/app/layout'
import config from 'config'
import {Confirm, Signature} from 'components/images'

const ConfirmSubscriptionPage = () => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex-grow flex items-center justify-center flex-col px-5 py-40">
        <Image />
        <div className="max-w-3xl text-center font-light">
          <h1 className="font-bold lg:text-5xl text-4xl py-8 font-heading">
            Please check your inbox for an email that just got sent.
          </h1>
          <p className="sm:text-xl leading-relaxed mx-auto pb-8">
            You'll need to click the confirmation link to receive any further
            emails. If you don't see the email after a few minutes, you might
            check your spam folder or other filters and add{' '}
            <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> to your
            contacts.
          </p>
          <p className="sm:text-lg">
            Thanks, <br />
            <Signature className="w-48 mx-auto pt-2" />
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmSubscriptionPage

const Image = () => {
  return (
    <div className="w-16 mx-auto pb-4">
      <Confirm />
    </div>
  )
}
