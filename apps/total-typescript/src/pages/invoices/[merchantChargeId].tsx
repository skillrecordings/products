import * as React from 'react'
import {DownloadIcon} from '@heroicons/react/outline'
import {useLocalStorage} from 'react-use'
import fromUnixTime from 'date-fns/fromUnixTime'
import Layout from '@/components/app/layout'
import format from 'date-fns/format'
import {Transfer} from '../../purchase-transfer/purchase-transfer'
import {trpc} from '../../trpc/trpc.client'
import {MailIcon} from '@heroicons/react/solid'
import {z} from 'zod'
import {useRouter} from 'next/router'
import {GetServerSideProps} from 'next'

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  const {merchantChargeId} = z
    .object({merchantChargeId: z.string()})
    .parse(query)

  return {
    props: {
      merchantChargeId,
    },
  }
}

const Invoice: React.FC<
  React.PropsWithChildren<{
    merchantChargeId: string
  }>
> = ({merchantChargeId}) => {
  const [invoiceMetadata, setInvoiceMetadata] = useLocalStorage(
    'invoice-metadata',
    '',
  )
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const router = useRouter()

  const {data: chargeDetails, status} = trpc.invoices.getChargeDetails.useQuery(
    {
      merchantChargeId,
    },
  )

  React.useEffect(() => {
    if (chargeDetails?.state !== 'SUCCESS' && status !== 'loading') {
      router.push('/invoices')
    }
  }, [status, chargeDetails?.state])

  const {data: purchaseUserTransfers, refetch} =
    trpc.purchaseUserTransfer.forPurchaseId.useQuery({
      id: chargeDetails?.result?.purchaseId,
    })

  if (chargeDetails?.state !== 'SUCCESS') {
    return null
  }

  const {charge, product, bulkCoupon, quantity} = chargeDetails.result

  const customer = z
    .object({name: z.string().nullish(), email: z.string().nullish()})
    .parse(charge.customer)

  const formatUsd = (amount: number) => {
    return Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const created = fromUnixTime(charge.created)
  const date = format(created, 'MMMM d, y')
  const amount = charge.amount / 100
  const instructorName = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  const productName = `${process.env.NEXT_PUBLIC_SITE_TITLE} by ${instructorName}`

  const emailData =
    isMounted &&
    `mailto:?subject=Invoice for ${process.env.NEXT_PUBLIC_SITE_TITLE}&body=Invoice for ${process.env.NEXT_PUBLIC_HOST} purchase: ${window.location}`

  return (
    <Layout
      meta={{title: `Invoice for ${productName}`}}
      footer={null}
      className="print:bg-white print:text-black"
      survey={false}
    >
      <main className="mx-auto max-w-screen-md">
        <div className="flex flex-col items-center justify-between px-5 pb-8 pt-20 text-center sm:pt-28 md:text-left print:hidden">
          <h1 className="pb-5 font-text text-2xl font-bold leading-tight sm:text-3xl">
            Your Invoice for {process.env.NEXT_PUBLIC_SITE_TITLE}
          </h1>
          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:pb-4">
            <button
              onClick={() => {
                window.print()
              }}
              className="flex w-full items-center justify-center rounded-md border border-cyan-600 bg-cyan-600 px-5 py-3 font-semibold leading-6 text-white transition-colors duration-200 ease-in-out hover:bg-cyan-700 sm:w-auto"
            >
              <span className="pr-2">Download PDF or Print</span>
              <DownloadIcon aria-hidden="true" className="w-5" />
            </button>
            {emailData && (
              <a
                href={emailData}
                className="flex w-full items-center justify-center rounded-md border border-cyan-300 px-5 py-3 font-semibold leading-6 text-cyan-300 transition-colors duration-200 ease-in-out hover:bg-cyan-600/20 sm:w-auto"
              >
                <span className="pr-2">Send via email</span>
                <MailIcon aria-hidden="true" className="w-5" />
              </a>
            )}
          </div>
        </div>
        <div className="rounded-t-md bg-white text-gray-900 shadow-xl print:shadow-none">
          <div className="px-10 py-16">
            <div className="grid w-full grid-cols-3 items-start justify-between">
              <div className="col-span-2 flex items-center">
                <span className="pl-2 font-text text-2xl font-bold">
                  {process.env.NEXT_PUBLIC_SITE_TITLE}
                </span>
              </div>
              <div>
                <h2 className="mb-2 text-xs uppercase text-gray-500">From</h2>
                <span className="font-semibold">{productName}</span>
                <br />
                co Skill Recordings Inc.
                <br />
                12333 Sowden Rd
                <br />
                Ste. B, PMB #97429
                <br />
                Houston, TX 77080-2059
                <br />
                972-992-5951
              </div>
            </div>
            <div className="grid grid-cols-3 pb-64">
              <div className="col-span-2">
                <p className="mb-2 text-2xl font-bold">Invoice</p>
                Invoice ID: <strong>{merchantChargeId}</strong>
                <br />
                Created: <strong>{date}</strong>
                <br />
                Status:{' '}
                <strong>
                  {charge.status === 'succeeded'
                    ? charge.refunded
                      ? 'Refunded'
                      : 'Paid'
                    : 'Pending'}
                </strong>
              </div>
              <div className="pt-12">
                <h2 className="mb-2 text-xs uppercase text-gray-500">
                  Invoice For
                </h2>
                <div className="break-all">
                  {customer.name}
                  <br />
                  {customer.email}
                  {/* <br />
                  {charge.billing_details.address?.city}
                  <br />
                  {charge.billing_details.address?.postal_code}
                  <br />
                  {charge.billing_details.address?.country} */}
                </div>
                {isMounted && (
                  <>
                    <textarea
                      aria-label="Invoice notes"
                      className="form-textarea mt-4 h-full w-full rounded-md border-2 border-cyan-500 bg-gray-50 p-3 placeholder-gray-700 print:mt-0 print:resize-none print:border-none print:bg-transparent print:p-0"
                      value={invoiceMetadata}
                      onChange={(e) => setInvoiceMetadata(e.target.value)}
                      placeholder="Enter additional info here (optional)"
                    />
                  </>
                )}
              </div>
            </div>
            <h2 className="sr-only">Purchase details</h2>
            <table className="w-full table-auto text-left">
              <thead className="table-header-group">
                <tr className="table-row">
                  <th scope="col">Description</th>
                  <th scope="col">Unit Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col" className="text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {quantity ? (
                  <tr className="table-row">
                    <td>{product.name}</td>
                    <td>
                      {charge.currency.toUpperCase()}{' '}
                      {formatUsd(charge.amount / 100 / quantity)}
                    </td>
                    <td>{quantity}</td>
                    <td className="text-right">
                      {amount === null
                        ? `${charge.currency.toUpperCase()} 0.00`
                        : `${charge.currency.toUpperCase()} ${formatUsd(
                            amount,
                          )}`}
                    </td>
                  </tr>
                ) : (
                  <tr className="table-row">
                    <td>{product.name}</td>
                    <td>
                      {charge.currency.toUpperCase()} {formatUsd(amount)}
                    </td>
                    <td>1</td>
                    <td className="text-right">
                      {amount === null
                        ? `${charge.currency.toUpperCase()} 0.00`
                        : `${charge.currency.toUpperCase()} ${formatUsd(
                            amount,
                          )}`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex flex-col items-end py-16">
              <div>
                <span className="mr-3">Total</span>
                <strong className="text-lg">
                  {charge.currency.toUpperCase()} {formatUsd(amount)}
                </strong>
              </div>
            </div>
          </div>
        </div>
        {!bulkCoupon && purchaseUserTransfers ? (
          <div className="py-16 print:hidden">
            <Transfer
              purchaseUserTransfers={purchaseUserTransfers}
              refetch={refetch}
            />
          </div>
        ) : null}
      </main>
    </Layout>
  )
}

export default Invoice
