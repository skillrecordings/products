import * as React from 'react'
import {ChevronRightIcon, DocumentTextIcon} from '@heroicons/react/solid'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {getSdk} from '@skillrecordings/database'
import {GetServerSideProps} from 'next'
import {format} from 'date-fns'
import Layout from 'components/app/layout'
import Link from 'next/link'
import {getToken} from 'next-auth/jwt'
import {Purchase} from '@skillrecordings/database'
import {getCurrentAbility} from '@skillrecordings/ability'

export const getServerSideProps: GetServerSideProps = async ({req}) => {
  const sessionToken = await getToken({req})
  const {getPurchasesForUser} = getSdk()

  const ability = getCurrentAbility(sessionToken as any)

  if (ability.can('view', 'Invoice')) {
    const purchases = await getPurchasesForUser(sessionToken?.sub)
    return {
      props: {
        purchases: purchases.map(convertToSerializeForNextResponse),
      },
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}

const Learn: React.FC<React.PropsWithChildren<{purchases: Purchase[]}>> = ({
  purchases = [],
}) => {
  return (
    <Layout meta={{title: 'Invoices'}}>
      <main className="mx-auto flex h-full w-full max-w-2xl flex-grow flex-col px-5 py-24 sm:py-32">
        <h1 className="font-heading pb-4 text-3xl font-black">Your Invoices</h1>
        <ul className="flex flex-col gap-2">
          {purchases
            .filter((purchase: Purchase) => purchase.merchantChargeId)
            .map((purchase: Purchase | any) => {
              return (
                <li key={purchase.merchantChargeId}>
                  <InvoiceCard purchase={purchase} />
                </li>
              )
            })}
        </ul>
      </main>
    </Layout>
  )
}

export const InvoiceCard: React.FC<{purchase: Purchase | any}> = ({
  purchase,
}) => {
  return (
    <Link href={`/invoices/${purchase.merchantChargeId}`} className="group">
      <div className="flex items-start rounded-lg border border-indigo-600 px-5 py-6 shadow-xl ">
        <div>
          <DocumentTextIcon aria-hidden className="w-6 text-sky-500" />
        </div>
        <div className="flex w-full flex-col justify-between gap-2 pl-2 sm:flex-row sm:items-center">
          <div className="font-semibold group-hover:underline">
            Invoice: {purchase?.product?.name}
          </div>
          <div className="flex flex-wrap text-sm md:pr-2">
            <span className="after:content-['・']">
              {Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(purchase.totalAmount)}
            </span>
            <span>{format(new Date(purchase.createdAt), 'MMMM d, y')}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Learn
