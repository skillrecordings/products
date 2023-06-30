import {ArrowRightIcon} from '@heroicons/react/solid'
import {Purchase} from '@skillrecordings/database'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@skillrecordings/skill-lesson/ui'
import Layout from 'components/app/layout'
import Link from 'next/link'
import {DatePurchased, Price} from 'purchase-details/purchase-details-template'
import Balancer from 'react-wrap-balancer'

export type PurchasesIndexProps = {
  purchases: (Purchase & {
    id: string
    bulkCoupon: string
    product: {name: string}
    createdAt: string
    totalAmount: number
    redeemedBulkCouponId: string | null
  })[]
}

const PurchasesIndexTemplate: React.FC<PurchasesIndexProps> = ({purchases}) => {
  return (
    <Layout meta={{title: 'My Purchases'}}>
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-3 px-5 pt-16 text-center">
        <h1 className="mx-auto text-center text-4xl font-semibold">
          My Purchases
        </h1>
        <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-400">
          <Balancer>
            View all the information about your purchased workshops. Access
            invoices, add more seats, or invite team members.
          </Balancer>
        </h2>
      </header>

      <main className="mx-auto grid w-full max-w-2xl grid-cols-2 flex-col gap-8 px-5 py-16">
        {purchases
          ?.filter((p) => !p.redeemedBulkCouponId)
          .map((purchase) => {
            return (
              <Card key={purchase.id}>
                <CardHeader>
                  <CardTitle>{purchase.product.name}</CardTitle>
                  <div className="flex gap-3 pt-3 opacity-80">
                    <Price amount={purchase.totalAmount} />
                    <DatePurchased date={purchase.createdAt} />
                  </div>
                </CardHeader>
                <CardContent></CardContent>
                <CardFooter className="space-x-2">
                  <Button asChild size="sm">
                    <Link href={`/purchases/${purchase.id}`}>
                      {purchase.bulkCoupon ? 'Manage' : 'Details'}
                    </Link>
                  </Button>
                  <Button variant="secondary" asChild size="sm">
                    <Link
                      href={{
                        pathname: '/invoices/[merchantChargeId]',
                        query: {merchantChargeId: purchase.merchantChargeId},
                      }}
                    >
                      Invoice
                    </Link>
                  </Button>
                </CardFooter>
                {/* <article className="rounded-lg border border-gray-100 bg-white px-8 pb-5 pt-8 shadow-2xl shadow-gray-500/10 dark:border-gray-800 dark:bg-gray-900">
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
                  <Link
                    href={{
                      pathname: '/invoices/[merchantChargeId]',
                      query: {merchantChargeId: purchase.merchantChargeId},
                    }}
                  >
                    Invoice
                  </Link>
                </div>
              </article> */}
              </Card>
            )
          })}
      </main>
    </Layout>
  )
}

export default PurchasesIndexTemplate
