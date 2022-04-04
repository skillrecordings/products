import * as React from 'react'
import {GetServerSideProps} from 'next'
import {stripe} from 'utils/stripe'
import {Stripe} from 'stripe'

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
  return (
    <div>
      Hey ${name}, an email has been sent to {email}
    </div>
  )
}

export default ThanksVerify
