import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getSdk} from '@skillrecordings/database'
import Layout from 'components/app/layout'
import {LoginLink} from './purchase'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {query} = context

  const {purchaseId} = query

  const {getPurchaseWithUser} = getSdk()

  const purchase = await getPurchaseWithUser(purchaseId as string)

  return {
    props: {
      email: purchase?.user?.email,
    },
  }
}

const ThanksRedeem: React.FC<
  React.PropsWithChildren<{purchase: any; email: string}>
> = ({email}) => {
  return (
    <Layout footer={null}>
      <main className="flex flex-grow flex-col items-center justify-center px-5 pt-5 pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="w-full pb-3 font-semibold uppercase tracking-wide">
            Success!
          </h1>
          <LoginLink email={email} />
        </div>
      </main>
    </Layout>
  )
}

export default ThanksRedeem
