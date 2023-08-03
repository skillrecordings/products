import React from 'react'
import Layout from '@/components/app/layout'
import config from '@/config'
import Balancer from 'react-wrap-balancer'
import {motion} from 'framer-motion'

const ConfirmSubscriptionPage = () => {
  return (
    <Layout meta={{title: 'Confirm your subscription'}}>
      <main className="flex flex-grow flex-col items-center justify-center px-5">
        <Image />
        <div className="max-w-xl text-center">
          {/* <p className="sm:text-xl">
            Thanks so much for signing up! There’s one last step.
          </p> */}
          <motion.h1
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="pb-8 text-2xl font-semibold sm:text-3xl"
          >
            <Balancer>
              Please check your inbox for an email that just got sent.
            </Balancer>
          </motion.h1>
          <p className="mx-auto pb-8 leading-relaxed sm:text-lg">
            <Balancer>
              You'll need to click the confirmation link to receive any further
              emails. If you don't see the email after a few minutes, you might
              check your spam folder or other filters and add{' '}
              <a
                className="font-semibold underline"
                href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
              >
                {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
              </a>{' '}
              to your contacts.
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
