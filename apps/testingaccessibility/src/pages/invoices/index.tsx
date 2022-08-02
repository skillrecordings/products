import * as React from 'react'
import {DocumentTextIcon} from '@heroicons/react/outline'
import {ChevronRightIcon} from '@heroicons/react/solid'
import {convertToSerializeForNextResponse} from 'utils/prisma-next-serializer'
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
    <Layout meta={{title: 'Invoices'}} className="bg-green-700 bg-noise">
      <main className="max-w-2xl mx-auto w-full sm:py-16 py-8 flex-grow h-full px-5 flex flex-col">
        <h1 className="text-3xl font-medium pb-4 text-white font-heading">
          Your Invoices
        </h1>
        <ul className="flex flex-col gap-2">
          {purchases
            .filter((purchase: Purchase) => purchase.merchantChargeId)
            .map((purchase: Purchase | any) => {
              return (
                <li key={purchase.merchantChargeId}>
                  <div className="flex sm:flex-row flex-col justify-between sm:items-center bg-white p-5 rounded-md shadow-sm">
                    <div className="flex gap-2 w-full">
                      <div>
                        <DocumentTextIcon
                          aria-hidden
                          className="w-6 text-green-500"
                        />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold leading-tight">
                          Testing Accessibility ({purchase.product.name}){' '}
                        </h2>
                        <div className="opacity-80 flex text-sm sm:pt-1 pt-2">
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
                      <a className="sm:mt-0 mt-5 flex-shrink-0 text-green-600 font-medium flex items-center sm:justify-center justify-end rounded-md px-3 py-2 hover:bg-moss-50 hover:bg-opacity-60 transition text-sm">
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
