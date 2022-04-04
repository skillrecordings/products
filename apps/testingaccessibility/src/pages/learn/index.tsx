import * as React from 'react'
import {GetServerSideProps} from 'next'
import {stripe} from 'utils/stripe'
import {Stripe} from 'stripe'
import {getDecodedToken} from '../../utils/get-decoded-token'
import {session} from 'next-auth/core/routes'
import {getSdk} from '../../lib/prisma-api'
import {Purchase} from '@prisma/client'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const sessionToken = await getDecodedToken(req)
  const {getPurchasesForUser} = getSdk()

  if (sessionToken && sessionToken.sub) {
    const purchases = await getPurchasesForUser(sessionToken.sub)
    return {
      props: {
        purchases,
      },
    }
  }
  return {
    props: {},
  }
}

const Learn: React.FC<{purchases: Purchase[]}> = ({purchases}) => {
  return <div>Available Stuff: {JSON.stringify(purchases)}</div>
}

export default Learn
