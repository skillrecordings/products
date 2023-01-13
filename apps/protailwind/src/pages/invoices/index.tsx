import * as React from 'react'
import {ChevronRightIcon, DocumentTextIcon} from '@heroicons/react/solid'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {getSdk} from '@skillrecordings/database'
import {GetServerSideProps} from 'next'
import {format} from 'date-fns'
import Layout from 'components/layout'
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
      <main className="mx-auto flex h-full w-full max-w-2xl flex-grow flex-col py-24 px-5 sm:py-32">
        <h1 className="font-text pb-4 text-3xl font-medium text-white">
          Your Invoices
        </h1>
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
    <Link href={`/invoices/${purchase.merchantChargeId}`}>
      <a className="group">
        <div className="flex items-start rounded-lg border border-gray-100 bg-white px-5 py-6 shadow-xl shadow-gray-400/5">
          <div>
            <DocumentTextIcon aria-hidden className="w-6 text-sky-500" />
          </div>
          <div className="flex w-full flex-col justify-between gap-2 pl-2 sm:flex-row sm:items-center">
            <div className="font-semibold group-hover:underline">
              Invoice: {purchase?.product?.name}
            </div>
            <div className="flex text-sm text-gray-600 md:pr-2">
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
      </a>
    </Link>
  )
}

export default Learn
