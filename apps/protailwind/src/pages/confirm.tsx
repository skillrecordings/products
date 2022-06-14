import React from 'react'
import Layout from 'components/layout'

const ConfirmSubscriptionPage = () => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex-grow flex items-center justify-center flex-col">
        <div className="max-w-lg text-center font-light">
          <p className="sm:text-xl">
            Thanks so much for signing up! There’s one last step.
          </p>
          <h1 className="font-bold lg:text-5xl sm:text-4xl text-3xl py-8 font-heading">
            Please check your inbox for an email that just got sent.
          </h1>
          <p className="sm:text-xl opacity-80 leading-relaxed mx-auto pb-8">
            You'll need to click the confirmation link to receive any further
            emails. If you don't see the email after a few minutes, you might
            check your spam folder or other filters and add{' '}
            <strong>team@protailwind.com</strong> to your contacts.
          </p>
          <p className="sm:text-lg opacity-80">
            Thanks, <br />— Simon
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmSubscriptionPage
