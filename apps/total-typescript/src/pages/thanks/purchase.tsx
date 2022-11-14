import * as React from 'react'
import {GetServerSideProps} from 'next'
import {Stripe} from 'stripe'
import Layout from 'components/app/layout'
import {MailIcon} from '@heroicons/react/outline'
import {getStripeSdk} from '@skillrecordings/stripe-sdk'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {query} = context

  const {session_id} = query

  if (!session_id) {
    return {
      notFound: true,
    }
  }

  const {getCheckoutSession} = getStripeSdk()

  const checkoutSession = await getCheckoutSession(session_id as string)

  const {customer} = checkoutSession
  const {email, name} = customer as Stripe.Customer

  return {
    props: {
      email,
      name,
    },
  }
}

const ThanksVerify: React.FC<
  React.PropsWithChildren<{name: string; email: string}>
> = ({name, email}) => {
  return (
    <Layout footer={null} meta={{title: 'Purchase Successful'}}>
      <main className="font-brandon flex min-h-screen flex-grow flex-col items-center justify-center py-28 px-5 text-white">
        <div className="mx-auto flex w-full max-w-screen-md flex-col items-center gap-5 text-center">
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-medium text-cyan-200 sm:text-xl">
              Thank you for purchasing {process.env.NEXT_PUBLIC_SITE_TITLE}!
            </h1>
            <h2 className="mx-auto max-w-lg pt-4 text-2xl font-bold sm:text-4xl">
              Please check your inbox for an email that just got sent.
            </h2>
            <code className="font-brandon my-10 flex items-center justify-center gap-2 rounded-md bg-gray-800 px-6 py-3 text-lg font-medium text-white sm:text-xl">
              <MailIcon className="h-5 w-5 text-cyan-300" aria-hidden="true" />{' '}
              <span className="text-cyan-300">sent to:</span> {email}
            </code>
            <p className="mx-auto max-w-sm leading-relaxed text-gray-200 sm:text-lg">
              As a final step to access you need to check your inbox (
              <strong>{email}</strong>) where you will find an email from{' '}
              <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> with a
              link to access your purchase.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default ThanksVerify
