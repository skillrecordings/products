import React from 'react'
import Layout from '@/components/app/layout'
import {Signature} from './confirm'
import Container from '@/components/app/container'

const ConfirmedSubscriptionPage = () => {
  return (
    <Layout>
      <Container
        as="main"
        className="flex min-h-[calc(100svh-80px)] flex-grow flex-col items-center justify-center px-5"
      >
        <Image />
        <div className="max-w-lg text-center font-light">
          <h1 className="py-8 text-3xl lg:text-4xl">You're Confirmed!</h1>
          <p className="mx-auto pb-8 text-sm leading-relaxed text-gray-300 sm:text-base">
            You're all set to receive emails from me about{' '}
            {process.env.NEXT_PUBLIC_SITE_TITLE}.
          </p>
          <Signature />
        </div>
      </Container>
    </Layout>
  )
}

export default ConfirmedSubscriptionPage

const Image = () => {
  return null
}
