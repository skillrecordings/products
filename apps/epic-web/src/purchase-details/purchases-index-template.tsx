import {ArrowRightIcon} from '@heroicons/react/solid'
import {Purchase} from '@skillrecordings/database'
import Layout from 'components/app/layout'
import Link from 'next/link'
import {DatePurchased, Price} from 'purchase-details/purchase-details-template'
import Balancer from 'react-wrap-balancer'

export type PurchasesIndexProps = {
  purchases: Purchase &
    {
      id: string
      bulkCoupon: string
      product: {name: string}
      createdAt: string
      totalAmount: number
      redeemedBulkCouponId: string | null
    }[]
}

const PurchasesIndexTemplate: React.FC<PurchasesIndexProps> = ({purchases}) => {
  return (
    <Layout meta={{title: 'Your Purchases'}}>
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-3 px-5 pt-16 text-center">
        <h1 className="mx-auto text-center text-4xl font-semibold">
          Your Purchases
        </h1>
        <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-400">
          <Balancer>
            View details about your purchases. Get your invoice, buy more seats,
            or invite your team members.
          </Balancer>
        </h2>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 py-16">
        {purchases
          ?.filter((p) => !p.redeemedBulkCouponId)
          .map((purchase) => {
            return (
              <article className="rounded-lg border border-gray-100 bg-white px-8 pb-5 pt-8 shadow-2xl shadow-gray-500/10 dark:border-gray-800 dark:bg-gray-900">
                <h2 className="font-heading text-2xl font-black sm:text-2xl">
                  <Balancer>
                    <Link
                      href={`/purchases/${purchase.id}`}
                      className="hover:underline"
                    >
                      {purchase.product.name}
                    </Link>
                  </Balancer>
                </h2>
                <div className="mt-5 flex w-full items-center justify-between border-t border-dotted border-gray-100 pt-4 dark:border-gray-700">
                  <div className="flex items-center ">
                    <Price amount={purchase.totalAmount} />
                    {' ・ '}
                    <DatePurchased date={purchase.createdAt} />
                  </div>
                  <Link
                    href={`/purchases/${purchase.id}`}
                    className="flex items-center gap-2 font-medium text-primary underline"
                  >
                    View details {purchase.bulkCoupon && 'and invite your team'}{' '}
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            )
          })}
      </main>
    </Layout>
  )
}

export default PurchasesIndexTemplate
