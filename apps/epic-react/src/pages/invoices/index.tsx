import * as React from 'react'
import Balancer from 'react-wrap-balancer'
import {ChevronRightIcon, DocumentTextIcon} from '@heroicons/react/solid'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {getSdk} from '@skillrecordings/database'
import {GetServerSideProps} from 'next'
import {format} from 'date-fns'
import Layout from '@/components/app/layout'
import Link from 'next/link'
import {getToken} from 'next-auth/jwt'
import {Purchase} from '@skillrecordings/database'
import {getCurrentAbility} from '@skillrecordings/ability'
import {cn} from '@skillrecordings/ui/utils/cn'
import {formatUsd} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'

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

const Invoices: React.FC<React.PropsWithChildren<{purchases: Purchase[]}>> = ({
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

export const InvoiceCard: React.FC<{
  target?: '_blank' | '_self'
  purchase: Purchase | any
  className?: string
}> = ({purchase, className, target = '_self'}) => {
  return (
    <Link
      target={target}
      href={`/invoices/${purchase.merchantChargeId}`}
      className="group"
    >
      <div
        className={cn(
          'flex items-start rounded-lg border border-gray-100 bg-white px-5 py-6 dark:border-gray-800 dark:bg-gray-900',
          className,
        )}
      >
        <div>
          <DocumentTextIcon aria-hidden className="w-6 text-primary" />
        </div>
        <div
          data-content=""
          className="flex w-full flex-col justify-between gap-2 pl-2 sm:flex-row sm:items-center"
        >
          <div className="font-semibold group-hover:underline">
            Invoice:{' '}
            <span className="font-medium text-gray-700 group-hover:underline dark:text-gray-300">
              <Balancer>{purchase?.product?.name}</Balancer>
            </span>
          </div>
          <div className="flex flex-wrap text-sm md:pr-2">
            <span className="after:content-['・']">
              <sup>US</sup>
              {formatUsd(purchase.totalAmount).dollars}
              <sup>{formatUsd(purchase.totalAmount).cents}</sup>
            </span>
            <span>{format(new Date(purchase.createdAt), 'MMMM d, y')}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Invoices
