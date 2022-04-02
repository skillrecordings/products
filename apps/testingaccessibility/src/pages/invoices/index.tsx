import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getDecodedToken} from '../../utils/get-decoded-token'
import {getSdk} from '../../lib/prisma-api'
import Link from 'next/link'
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

const Learn: React.FC<{purchases: Purchase[]}> = ({purchases = []}) => {
  return (
    <div>
      <h1>Access stuff</h1>
      <p>Available Invoices: </p>
      <ul>
        {purchases.map((purchase) => {
          return (
            <li key={purchase.merchantChargeId}>
              <Link href={`/invoices/${purchase.merchantChargeId}`}>
                {purchase.merchantChargeId}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Learn
