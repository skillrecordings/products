import * as React from 'react'
import {getDecodedToken} from '../../utils/get-decoded-token'
import {getSdk} from '../../lib/prisma-api'
import {GetServerSideProps} from 'next'
import {Product, Purchase} from '@prisma/client'
import Layout from 'components/app/layout'
import Link from 'next/link'
import {serialize} from 'utils/prisma-next-serializer'
import {format} from 'date-fns'
import {DocumentTextIcon} from '@heroicons/react/outline'
import {ChevronRightIcon} from '@heroicons/react/solid'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const sessionToken = await getDecodedToken(req)
  const {getPurchasesForUser} = getSdk()

  if (sessionToken && sessionToken.sub) {
    const purchases = await getPurchasesForUser(sessionToken.sub)
    return {
      props: {
        purchases: purchases.map(serialize),
      },
    }
  }
  return {
    props: {},
  }
}

const Learn: React.FC<{purchases: Purchase[]}> = ({purchases = []}) => {
  return (
    <Layout meta={{title: 'Invoices'}} className="bg-gray-50">
      <main className="max-w-xl mx-auto w-full sm:py-16 py-8 flex-grow h-full px-5 flex flex-col">
        <h1 className="text-3xl font-bold pb-4">Your Invoices</h1>
        <ul className="flex flex-col gap-2">
          {purchases.map((purchase: Purchase | any) => {
            return (
              <li key={purchase.merchantChargeId}>
                <div className="flex sm:flex-row flex-col justify-between sm:items-center bg-white p-5 rounded-md shadow-sm">
                  <div className="flex gap-2 w-full">
                    <div>
                      <DocumentTextIcon
                        aria-hidden
                        className="w-6 text-blue-500"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold leading-tight">
                        Testing Accessibility ({purchase.product.name}){' '}
                      </h2>
                      <div className="opacity-80 flex font-medium text-sm sm:pt-0 pt-2">
                        <span className="after:content-['・']">
                          USD {purchase.totalAmount}.00
                        </span>
                        <span>
                          {format(new Date(purchase.createdAt), 'MMMM d, y')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/invoices/${purchase.merchantChargeId}`}>
                    <a className="sm:mt-0 mt-5 flex-shrink-0 text-blue-500 hover:text-blue-600 font-semibold flex items-center sm:justify-center justify-end rounded-md px-3 py-2 hover:bg-gray-100 hover:bg-opacity-60 transition">
                      <span className="pr-0.5">View Invoice</span>
                      <ChevronRightIcon aria-hidden="true" className="w-5" />
                    </a>
                  </Link>
                  {/* {purchase.merchantChargeId} */}
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
