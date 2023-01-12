import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getSdk} from '@skillrecordings/database'
import Layout from 'components/layout'
import {MailIcon} from '@heroicons/react/outline'

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
    <Layout footer={null} className="bg-noise">
      <main className="flex flex-grow flex-col items-center justify-center px-5 pt-5 pb-16 text-white">
        <div className="mx-auto flex w-full max-w-screen-md flex-col items-center gap-5 text-center">
          <div>
            <p className="font-heading text-xl font-medium text-cyan-200">
              Success!
            </p>
            <h1 className="mx-auto max-w-lg py-5 text-3xl font-bold lg:text-4xl">
              Please check your inbox for a login link that just got sent.
              <code className="my-10 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 font-sans text-lg font-semibold text-black sm:text-xl">
                <MailIcon
                  className="h-5 w-5 text-cyan-500"
                  aria-hidden="true"
                />{' '}
                {email}
              </code>
            </h1>
            <p className="text-sand-100 mx-auto max-w-md font-medium leading-relaxed">
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

export default ThanksRedeem
