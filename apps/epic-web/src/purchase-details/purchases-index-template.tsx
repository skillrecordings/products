import {ArrowRightIcon} from '@heroicons/react/solid'
import {Purchase} from '@skillrecordings/database'
import Layout from 'components/app/layout'
import Link from 'next/link'
import {DatePurchased, Price} from 'purchase-details/purchase-details-template'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import PageHeadline from 'components/page-headline'
import PageSubheadline from 'components/page-subheadline'

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
      <header className="mx-auto px-5 pt-16 text-center sm:pt-20">
        <PageHeadline>Your Purchases</PageHeadline>
        <PageSubheadline>
          View details about your purchases. Get your invoice, buy more seats,
          or invite your team members.
        </PageSubheadline>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 py-16">
        {purchases
          ?.filter((p) => !p.redeemedBulkCouponId)
          .map((purchase) => {
            return (
              <article className="rounded-lg border border-gray-200/50 px-8 pb-5 pt-10 shadow-2xl shadow-gray-500/10">
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
                <div className="mt-8 flex w-full items-center justify-between border-t border-dotted border-gray-300 pt-4">
                  <div className="flex items-center ">
                    <Price amount={purchase.totalAmount} />
                    {' ・ '}
                    <DatePurchased date={purchase.createdAt} />
                  </div>
                  <Link
                    href={`/purchases/${purchase.id}`}
                    className="flex items-center gap-2 font-medium text-sky-500 underline"
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
