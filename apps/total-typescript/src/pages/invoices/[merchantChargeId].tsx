import * as React from 'react'
import {DownloadIcon} from '@heroicons/react/outline'
import {useLocalStorage} from 'react-use'
import {GetServerSideProps} from 'next'
import {stripe} from '@skillrecordings/commerce-server'
import {Stripe} from 'stripe'
import fromUnixTime from 'date-fns/fromUnixTime'
import Layout from 'components/app/layout'
import format from 'date-fns/format'
import {getToken} from 'next-auth/jwt'
import {first, get} from 'lodash'
import {NavLogo} from 'components/app/navigation'
import Image from 'next/image'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  query,
}) => {
  const sessionToken = await getToken({req})
  const {merchantChargeId} = query
  if (merchantChargeId) {
    const charge = await stripe.charges.retrieve(merchantChargeId as string)
    const invoice = await stripe.invoices.retrieve(charge.invoice as string)

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    return {
      props: {
        charge,
        invoice,
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

const Invoice: React.FC<
  React.PropsWithChildren<{
    charge: Stripe.Charge
    invoice: Stripe.Invoice
    product: {name: string}
    merchantChargeId: string
  }>
> = ({charge, invoice}) => {
  console.log({charge})
  const [invoiceMetadata, setInvoiceMetadata] = useLocalStorage(
    'invoice-metadata',
    '',
  )
  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!charge) {
    return null
  }

  const created = fromUnixTime(charge.created)
  const date = format(created, 'MMMM d, y')
  const amount = charge?.amount / 100
  const instructorName = 'Matt Pocock'
  const productName = `Total TypeScript by ${instructorName}`

  return charge && invoice ? (
    <Layout
      meta={{title: `Invoice ${charge.id}`}}
      footer={null}
      nav={null}
      className="bg-gray-800"
    >
      <main className="max-w-screen-md mx-auto">
        <div className="flex md:flex-row flex-col items-center justify-between md:text-left text-center py-8 print:hidden">
          <h1 className="sm:text-3xl text-2xl font-medium leading-tight max-w-md">
            Invoice
            <div className="text-base text-gray-300">
              for {invoice.customer_name}
            </div>
          </h1>
          <button
            onClick={() => {
              window.print()
            }}
            className="my-4 flex items-center leading-6 px-5 py-3 text-sm font-semibold rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors ease-in-out duration-200"
          >
            <span className="pr-2">Download PDF or Print</span>
            <DownloadIcon aria-hidden="true" className="w-5" />
          </button>
        </div>
        <div className="bg-white text-gray-900 rounded-t-md shadow-xl print:shadow-none">
          <div className="px-10 py-16">
            <div className="grid grid-cols-3 w-full justify-between items-start">
              <div className="col-span-2 flex items-center gap-2">
                <Image
                  src={require('../../../public/assets/gem-darker.png')}
                  alt=""
                  width={32}
                  height={32}
                  quality={100}
                  aria-hidden="true"
                />{' '}
                <NavLogo className="text-gray-800 text-2xl tracking-tight" />
              </div>
              <div>
                <h2 className="uppercase text-xs mb-2 font-semibold text-gray-500">
                  From
                </h2>
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
                <p className="text-3xl font-bold pb-2">Invoice</p>
                Invoice ID:{' '}
                <strong className="font-semibold">{charge.id}</strong>
                <br />
                Created: <strong className="font-semibold">{date}</strong>
                <br />
                Status:{' '}
                <strong className="font-semibold">
                  {charge.status === 'succeeded' ? 'Paid' : 'Pending'}
                </strong>
              </div>
              <div className="pt-12">
                <h2 className="uppercase text-xs mb-2 text-gray-600 font-semibold">
                  Invoice For
                </h2>
                <div>
                  {invoice.customer_name}
                  {charge.billing_details.name}
                  <br />
                  {invoice.customer_email}
                  {charge.billing_details.email}
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
                      className="print:hidden p-3 mt-4 form-textarea placeholder-cyan-900 border-2 border-cyan-500 rounded-md bg-cyan-50 w-full h-full print:p-0 print:border-none print:bg-transparent"
                      value={invoiceMetadata}
                      onChange={(e) => setInvoiceMetadata(e.target.value)}
                      placeholder="Enter additional info here (optional)"
                    />
                    <div className="print:block hidden">{invoiceMetadata}</div>
                  </>
                )}
              </div>
            </div>
            <h2 className="sr-only">Purchase details</h2>
            <table className="table-auto w-full text-left">
              <thead className="table-header-group">
                <tr className="table-row">
                  <th scope="col" className="font-semibold">
                    Description
                  </th>
                  <th scope="col" className="font-semibold">
                    Unit Price
                  </th>
                  <th scope="col" className="font-semibold">
                    Quantity
                  </th>
                  <th scope="col" className="font-semibold text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* {map(sitePurchases, (purchase) => (
                  <InvoiceItem key={purchase.guid} purchase={purchase} />
                ))} */}
                {/* {invoice.lines.data} */}
                {/* Stripe.ApiList<Stripe.InvoiceLineItem>.data: Stripe.InvoiceLineItem[] */}
                {invoice.lines.data.map((product: Stripe.InvoiceLineItem) => {
                  return (
                    <tr className="table-row">
                      <td>{product.description}</td>
                      <td>
                        {charge.currency.toUpperCase()}{' '}
                        {Number(
                          Number(product.price?.unit_amount) -
                            Number(
                              get(first(product.discount_amounts), 'amount'),
                            ),
                        ) / 100}
                      </td>
                      <td>1</td>
                      <td className="text-right">
                        {product.price
                          ? `${product.price.currency.toUpperCase()} ${amount}`
                          : `USD 0.00`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="flex flex-col items-end py-16">
              <div>
                <span className="mr-3">Total</span>
                <strong className="font-semibold text-lg">
                  {charge.currency.toUpperCase()} {amount}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  ) : null
}

export default Invoice
