import * as React from 'react'
import {GetServerSideProps} from 'next'
import {stripe} from 'utils/stripe'
import {Stripe} from 'stripe'
import {getDecodedToken} from '../../utils/get-decoded-token'
import prisma from '../../db'

export const getServerSideProps: GetServerSideProps = async ({query, res}) => {
  const {merchantChargeId} = query

  if (merchantChargeId) {
    const merchantCharge = await prisma.merchantCharge.findUnique({
      where: {
        id: merchantChargeId as string,
      },
      select: {
        identifier: true,
      },
    })

    if (merchantCharge && merchantCharge.identifier) {
      const charge = await stripe.charges.retrieve(merchantCharge.identifier)
      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {
          charge,
        },
      }
    }
  }

  return {
    redirect: {
      destination: '/invoices',
      permanent: false,
    },
  }
}

const Invoice: React.FC<{charge: Stripe.Charge}> = ({charge}) => {
  return <div>Charge: {JSON.stringify(charge)}</div>
}

export default Invoice
