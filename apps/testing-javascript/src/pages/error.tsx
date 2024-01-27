import * as React from 'react'
import Layout from '@/components/layout'
import {useRouter} from 'next/router'

const ErrorPage = ({}) => {
  const router = useRouter()
  const {type} = router.query

  let message = 'There was an unexpected error'

  if (type === 'stripe-checkout') {
    message = 'Something went wrong with the Stripe Checkout session'
  }

  return (
    <Layout meta={{title: message}}>
      <main className="grow flex items-center justify-center flex-col px-5">
        <div className="max-w-screen-sm text-center font-light">
          <h1 className="font-bold lg:text-5xl text-4xl py-8 font-heading">
            {message}
          </h1>
          <p className="sm:text-xl leading-relaxed mx-auto pb-8">
            We're looking into the issue. If it persists, you can let support
            know at <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong>.
          </p>
        </div>
      </main>
    </Layout>
  )
}

export default ErrorPage
