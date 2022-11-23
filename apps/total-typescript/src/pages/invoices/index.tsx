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
      <main className="mx-auto flex h-full w-full max-w-2xl flex-grow flex-col py-24 px-5 sm:py-32">
        <h1 className="pb-4 font-text text-3xl font-medium text-white">
          Your Invoices
        </h1>
        <ul className="flex flex-col gap-2">
          {purchases
            .filter((purchase: Purchase) => purchase.merchantChargeId)
            .map((purchase: Purchase | any) => {
              return (
                <li key={purchase.merchantChargeId}>
                  <div className="flex flex-col justify-between rounded-md bg-black/60 p-5 sm:flex-row sm:items-center">
                    <div className="flex w-full gap-2">
                      <div>
                        <DocumentTextIcon
                          aria-hidden
                          className="w-6 text-cyan-500"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold leading-tight">
                          {process.env.NEXT_PUBLIC_SITE_TITLE} (
                          {purchase.product.name}){' '}
                        </h2>
                        <div className="flex pt-2 text-sm text-gray-400 sm:pt-1">
                          <span className="after:content-['・']">
                            USD {purchase.totalAmount}
                          </span>
                          <span>
                            {format(new Date(purchase.createdAt), 'MMMM d, y')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/invoices/${purchase.merchantChargeId}`}>
                      <a className="mt-5 flex flex-shrink-0 items-center justify-end rounded-md bg-cyan-300/10 px-3 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-300/20 sm:mt-0 sm:justify-center">
                        <span className="pr-0.5">View Invoice</span>
                        <ChevronRightIcon aria-hidden="true" className="w-5" />
                      </a>
                    </Link>
                  </div>
                </li>
              )
            })}
        </ul>
      </main>
    </Layout>
  )
}

export default Learn
