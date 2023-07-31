import React from 'react'
import Layout from '@/components/app/layout'
import config from '@/config'
import Balancer from 'react-wrap-balancer'

const ConfirmSubscriptionPage = () => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <Image />
        <div className="max-w-screen-sm text-center">
          {/* <p className="sm:text-xl">
            Thanks so much for signing up! There’s one last step.
          </p> */}
          <h1 className="py-8 text-3xl font-medium lg:text-4xl">
            <Balancer>
              Please check your inbox for an email that just got sent.
            </Balancer>
          </h1>
          <p className="mx-auto pb-8 leading-relaxed sm:text-xl">
            <Balancer>
              You'll need to click the confirmation link to receive any further
              emails. If you don't see the email after a few minutes, you might
              check your spam folder or other filters and add{' '}
              <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> to your
              contacts.
            </Balancer>
          </p>
          <p className="sm:text-lg">
            Thanks, <br />
            <Signature />
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default ConfirmSubscriptionPage

export const Signature = () => {
  //TODO: add a signature
  return <>{config.author}</>
}

const Image = () => {
  //TODO: add an image
  return null
}
