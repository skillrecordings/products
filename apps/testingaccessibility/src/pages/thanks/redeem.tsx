import * as React from 'react'
import {GetServerSideProps} from 'next'
import prisma from '../../db'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {purchaseId} = query

  const purchase = await prisma.purchase.findFirst({
    where: {id: purchaseId as string},
    include: {
      user: true,
    },
  })

  return {
    props: {
      email: purchase?.user?.email,
    },
  }
}

const ThanksRedeem: React.FC<{purchase: any; email: string}> = ({email}) => {
  return <div>An email with a sign in link has been sent to {email}!</div>
}

export default ThanksRedeem
