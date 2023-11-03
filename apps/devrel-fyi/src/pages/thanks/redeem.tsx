import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getSdk} from '@skillrecordings/database'
import Layout from '@/components/app/layout'
import {MailIcon} from '@heroicons/react/solid'
import Balancer from 'react-wrap-balancer'
import {CheckIcon} from '@heroicons/react/outline'

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
    <Layout meta={{title: 'License claimed'}}>
      <main className="flex w-full flex-grow flex-col items-center justify-center px-5 text-center">
        <div className="flex w-full max-w-xl flex-col items-center">
          <div className="flex items-center justify-center rounded-full border border-emerald-600/75 bg-gradient-to-tr from-teal-500 to-emerald-500 p-5 font-mono text-xs font-semibold uppercase tracking-wide text-white shadow-inner dark:border-emerald-500 dark:from-teal-600 dark:to-emerald-600">
            <MailIcon className="h-6 w-6" />
          </div>
          <div className="mt-3 inline-flex items-center font-mono text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
            {/* <div className="inline-flex items-center rounded-full border border-emerald-600/75 bg-gradient-to-tr from-teal-500 to-emerald-500 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-white shadow-inner dark:border-emerald-500 dark:from-teal-600 dark:to-emerald-600"> */}
            <span className="flex items-center gap-1">license claimed</span>
          </div>
          <div>
            <h1 className="py-6 text-3xl font-semibold">
              <div>Login link sent to:</div>
              <div className="font-medium">{email}</div>
            </h1>
            <p className="opacity-75">
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
