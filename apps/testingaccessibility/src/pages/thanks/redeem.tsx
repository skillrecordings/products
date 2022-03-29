import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getAdminSDK} from '../../lib/api'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const {purchaseId} = query
  const {getPurchase} = getAdminSDK()

  const {purchases_by_pk: purchase} = await getPurchase({id: purchaseId})

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
