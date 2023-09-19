import * as React from 'react'
import {type GetServerSideProps} from 'next'
import {getSdk} from '@skillrecordings/database'
import Layout from 'components/layout'
import {MailIcon} from '@heroicons/react/solid'
import Balancer from 'react-wrap-balancer'

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
      <main className="flex flex-grow flex-col items-center justify-center p-5">
        <div className="w-full max-w-screen-md">
          <h1 className="pb-5 font-heading text-3xl font-black text-black">
            Success!
          </h1>
        </div>
        <div className="relative mx-auto flex w-full max-w-screen-md items-center justify-between gap-5 overflow-hidden rounded-xl bg-brand-red p-7 text-black shadow-2xl shadow-gray-400/20 sm:p-12">
          <div className="relative z-10">
            <p className="inline-flex rounded-full bg-white px-3 py-1 font-heading text-xs font-black uppercase text-brand-red sm:text-sm">
              Final step
            </p>
            <h2 className="mx-auto py-5 font-heading text-2xl font-black sm:text-3xl lg:text-4xl">
              <Balancer>
                Please check your inbox for a <i>login link</i> that just got
                sent.
              </Balancer>
            </h2>
            <div className="mb-3 inline-flex items-center gap-1 rounded-lg bg-white/20 py-3 px-4">
              <MailIcon className="h-5 w-5" />{' '}
              <strong className="font-semibold">Email sent to: {email}</strong>
            </div>
            <p className="mx-auto text-sm font-medium leading-relaxed text-black sm:text-base">
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
