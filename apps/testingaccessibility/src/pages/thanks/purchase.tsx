import * as React from 'react'
import {GetServerSideProps} from 'next'
import {Stripe} from 'stripe'
import Layout from 'components/app/layout'
import Image from 'next/image'
import NewMailImage from '../../../public/assets/new-mail@2x.png'
import {MailIcon} from '@heroicons/react/outline'
import {getCheckoutSession} from '../../lib/stripe'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../../utils/honeycomb-tracer'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {res, req, query} = context
  setupHttpTracing({
    name: getServerSideProps.name,
    tracer,
    req,
    res,
  })
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
    <Layout
      footer={null}
      className="bg-green-700 bg-noise"
      meta={{title: 'Purchase Successful'}}
    >
      <main className="flex flex-col flex-grow items-center justify-center pt-5 pb-16 px-5 text-white">
        <div className="flex flex-col max-w-screen-md mx-auto w-full gap-5 items-center text-center">
          <Image
            priority
            width={460 / 2}
            height={368 / 2}
            quality={100}
            placeholder="blur"
            src={NewMailImage}
            aria-hidden="true"
            alt=""
          />
          <div>
            <h1 className="text-orange-200 font-heading text-xl font-medium">
              Thank you for purchasing Testing Accessibility!
            </h1>
            <h2 className="max-w-lg mx-auto font-bold lg:text-4xl text-3xl py-5">
              Please check your inbox for a login link that just got sent.
              <code className="px-6 py-3 rounded-md bg-white inline-flex items-center gap-2 font-sans text-black my-10 font-semibold sm:text-xl text-lg">
                <MailIcon
                  className="w-5 h-5 text-green-500"
                  aria-hidden="true"
                />{' '}
                {email}
              </code>
            </h2>
            <p className="text-sand-100 max-w-md font-medium leading-relaxed mx-auto">
              As a final step to access the course you need to check your inbox
              (<strong>{email}</strong>) where you will find an email from{' '}
              <strong>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</strong> with a
              link to access your purchase and start learning.
            </p>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default ThanksVerify
