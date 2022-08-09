import * as React from 'react'
import {GetServerSideProps} from 'next'
import {Stripe} from 'stripe'
import Layout from 'components/app/layout'
import Image from 'next/image'
import {MailIcon} from '@heroicons/react/outline'
import {getCheckoutSession} from '../../lib/stripe'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {query} = context

  const {session_id} = query

  if (!session_id) {
    return {
      notFound: true,
    }
  }

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
      <main className="py-28 flex flex-col flex-grow items-center min-h-screen justify-center px-5 text-white font-brandon">
        <div className="flex flex-col max-w-screen-md mx-auto w-full gap-5 items-center text-center">
          <div className="flex flex-col items-center">
            <h1 className="text-orange-200 sm:text-xl text-lg font-medium">
              Thank you for purchasing {process.env.NEXT_PUBLIC_SITE_TITLE}!
            </h1>
            <h2 className="max-w-lg mx-auto font-bold sm:text-4xl text-2xl pt-4">
              Please check your inbox for an email that just got sent.
            </h2>
            <code className="px-6 py-3 rounded-md bg-gray-800 flex justify-center items-center gap-2 font-brandon text-white my-10 font-medium sm:text-xl text-lg">
              <MailIcon
                className="w-5 h-5 text-orange-300"
                aria-hidden="true"
              />{' '}
              <span className="text-orange-300">sent to:</span> {email}
            </code>
            <p className="text-gray-200 max-w-sm leading-relaxed mx-auto sm:text-lg">
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
