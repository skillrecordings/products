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
    <Layout meta={{title: 'Invoices'}} className="bg-gray-50 p-5">
      <main className="max-w-lg mx-auto w-full sm:py-10 py-5">
        <h1 className="text-3xl font-bold pb-4">Your Invoices</h1>
        <ul className="flex flex-col gap-2">
          {purchases.map((purchase: any) => {
            return (
              <li key={purchase.merchantChargeId}>
                {/* {JSON.stringify(purchase)} */}
                <Link href={`/invoices/${purchase.merchantChargeId}`}>
                  <a className="flex gap-2 bg-white p-5 rounded-md shadow-sm">
                    <div>
                      <DocumentTextIcon
                        aria-hidden
                        className="w-6 text-blue-500"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">
                        Testing Accessibility ({purchase.product.name}){' '}
                      </h2>
                      <div className="opacity-80">
                        {format(new Date(purchase.createdAt), 'MMMM d, y')}
                      </div>
                    </div>
                    {/* {purchase.merchantChargeId} */}
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </main>
    </Layout>
  )
}

export default Learn
