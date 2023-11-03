import React from 'react'
import Layout from '@/components/app/layout'
import config from '@/config'
import Container from '@/components/app/container'
import Balancer from 'react-wrap-balancer'

const ConfirmSubscriptionPage = () => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <Container
        as="main"
        className="flex min-h-[calc(100svh-80px)] flex-grow flex-col items-center justify-center px-5"
      >
        <Image />
        <div className="max-w-screen-sm text-center font-light">
          {/* <p className="sm:text-xl">
            Thanks so much for signing up! There’s one last step.
          </p> */}
          <h1 className="py-8 text-3xl lg:text-4xl">
            <Balancer>
              Please check your inbox for an email that just got sent.
            </Balancer>
          </h1>
          <p className="mx-auto pb-8 text-sm leading-relaxed text-gray-300 sm:text-base">
            <Balancer>
              You'll need to{' '}
              <strong className="text-primary">
                click the confirmation link
              </strong>{' '}
              to receive any further emails. If you don't see the email after a
              few minutes, you might check your spam folder or other filters and
              add <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> to
              your contacts.
            </Balancer>
          </p>
          <p className="text-sm text-gray-300 sm:text-base">
            Thanks, <br />
            <Signature />
          </p>
        </div>
      </Container>
    </Layout>
  )
}

export default ConfirmSubscriptionPage

export const Signature = () => {
  //TODO: add a signature
  return (
    <>
      {' '}
      <p className="text-sm text-gray-300 sm:text-base">
        Thanks, <br />
        {config.author}
      </p>
    </>
  )
}

const Image = () => {
  //TODO: add an image
  return null
}
