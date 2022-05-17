import * as React from 'react'
import {GetServerSideProps} from 'next'
import {stripe} from 'utils/stripe'
import {Stripe} from 'stripe'
import Layout from 'components/app/layout'
import Image from 'next/image'
import WoodenSignImage from '../../../public/assets/check-your-inbox@2x.png'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {session_id} = query

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    session_id as string,
    {
      expand: ['customer'],
    },
  )

  const {customer} = checkoutSession
  const {email, name} = customer as Stripe.Customer

  return {
    props: {
      email,
      name,
    },
  }
}

const ThanksVerify: React.FC<{name: string; email: string}> = ({
  name,
  email,
}) => {
  const tweet = `https://twitter.com/intent/tweet/?text=Just purchased TestingAccessibility.com by @MarcySutton`

  return (
    <Layout>
      <main className="flex flex-col flex-grow items-center justify-center py-16 px-5">
        <div className="flex md:flex-row flex-col max-w-2xl mx-auto w-full gap-10 md:items-start items-center md:text-left text-center">
          <div className="flex-shrink-0">
            <Image
              priority
              width={250}
              height={250}
              quality={100}
              placeholder="blur"
              src={WoodenSignImage}
              alt="a wooden sign with the words 'check your inbox'"
            />
          </div>
          <div>
            <h1 className="font-bold md:text-3xl text-2xl pb-4">
              Thank you for purchasing Testing Accessibility. Please check your
              inbox.
            </h1>
            <p className="opacity-80">
              As a final step to access the course you need to check your inbox
              (<strong>{email}</strong>) where you will find an email from{' '}
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL} with a link to access your
              purchase and start learning.
            </p>
            <hr className="my-6" />
            <p className="pb-4 font-semibold">
              Please consider telling your friends about
              TestingAccessibility.com, it would help me to get a word out.{' '}
              <span aria-hidden="true" role="img" aria-label="smiley">
                {':)'}
              </span>
            </p>
            <a
              href={tweet}
              rel="noopener noreferrer"
              target="_blank"
              className="text-white rounded-md inline-flex items-center px-3 py-2 ring-offset-1 shadow-inner"
              style={{background: '#1e7bc1'}}
            >
              <TwitterIcon />{' '}
              <span className="pl-2 font-bold text-sm">
                Share with your friends!
              </span>
            </a>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default ThanksVerify

const TwitterIcon = () => (
  <svg
    aria-hidden="true"
    height="16"
    width="16"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="#fff">
      <path d="M16,3c-0.6,0.3-1.2,0.4-1.9,0.5c0.7-0.4,1.2-1,1.4-1.8c-0.6,0.4-1.3,0.6-2.1,0.8c-0.6-0.6-1.5-1-2.4-1 C9.3,1.5,7.8,3,7.8,4.8c0,0.3,0,0.5,0.1,0.7C5.2,5.4,2.7,4.1,1.1,2.1c-0.3,0.5-0.4,1-0.4,1.7c0,1.1,0.6,2.1,1.5,2.7 c-0.5,0-1-0.2-1.5-0.4c0,0,0,0,0,0c0,1.6,1.1,2.9,2.6,3.2C3,9.4,2.7,9.4,2.4,9.4c-0.2,0-0.4,0-0.6-0.1c0.4,1.3,1.6,2.3,3.1,2.3 c-1.1,0.9-2.5,1.4-4.1,1.4c-0.3,0-0.5,0-0.8,0c1.5,0.9,3.2,1.5,5,1.5c6,0,9.3-5,9.3-9.3c0-0.1,0-0.3,0-0.4C15,4.3,15.6,3.7,16,3z" />
    </g>
  </svg>
)
