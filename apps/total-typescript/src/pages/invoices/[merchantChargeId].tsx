import * as React from 'react'
import {DownloadIcon} from '@heroicons/react/outline'
import {convertToSerializeForNextResponse} from '@skillrecordings/commerce-server'
import {useLocalStorage} from 'react-use'
import {GetServerSideProps} from 'next'
import {stripe} from '@skillrecordings/commerce-server'
import {Coupon, getSdk, MerchantProduct} from '@skillrecordings/database'
import {Stripe} from 'stripe'
import fromUnixTime from 'date-fns/fromUnixTime'
import Layout from 'components/app/layout'
import format from 'date-fns/format'
import {prisma} from '@skillrecordings/database'
import {getCurrentAbility} from '@skillrecordings/ability'
import {getToken} from 'next-auth/jwt'

export const getServerSideProps: GetServerSideProps = async ({
  res,
  req,
  query,
}) => {
  const sessionToken = await getToken({req})
  const {merchantChargeId} = query
  const {getProduct, getPurchaseForStripeCharge} = getSdk()
  const ability = getCurrentAbility(sessionToken as any)
  if (merchantChargeId && ability.can('view', 'Invoice')) {
    const merchantCharge = await prisma.merchantCharge.findUnique({
      where: {
        id: merchantChargeId as string,
      },
      select: {
        id: true,
        identifier: true,
        merchantProductId: true,
      },
    })

    if (merchantCharge && merchantCharge.identifier) {
      const charge = await stripe.charges.retrieve(merchantCharge.identifier)

      const merchantProductId = merchantCharge.merchantProductId
      const merchantProduct = await prisma.merchantProduct.findUnique({
        where: {
          id: merchantProductId as string,
        },
        select: {
          productId: true,
        },
      })
      const purchase = await getPurchaseForStripeCharge(
        merchantCharge.identifier,
      )
      const bulkCoupon = purchase && purchase.bulkCoupon

      const productId = merchantProduct?.productId
      const product = await getProduct({
        where: {id: productId},
      })

      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {
          charge,
          product: convertToSerializeForNextResponse(product),
          merchantChargeId,
          bulkCoupon: convertToSerializeForNextResponse(bulkCoupon),
        },
      }
    }
  }

  return {
    redirect: {
      destination: '/invoices',
      permanent: false,
    },
  }
}

const Invoice: React.FC<
  React.PropsWithChildren<{
    charge: Stripe.Charge
    product: {name: string}
    merchantChargeId: string
    merchantProduct: MerchantProduct
    bulkCoupon: Coupon
  }>
> = ({charge, product, merchantChargeId, merchantProduct, bulkCoupon}) => {
  const [invoiceMetadata, setInvoiceMetadata] = useLocalStorage(
    'invoice-metadata',
    '',
  )
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

  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Layout
      meta={{title: `Invoice ${merchantChargeId}`}}
      footer={null}
      className="print:bg-white print:text-black"
    >
      <main className="mx-auto max-w-screen-md">
        <div className="flex flex-col items-center justify-between pb-8 pt-28 text-center print:hidden md:flex-row md:text-left">
          <h1 className="max-w-md font-text text-2xl font-bold leading-tight sm:text-3xl">
            Your Invoice for {process.env.NEXT_PUBLIC_SITE_TITLE}
          </h1>
          <button
            onClick={() => {
              window.print()
            }}
            className="my-4 flex items-center rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold leading-6 text-white transition-colors duration-200 ease-in-out hover:bg-cyan-700"
          >
            <span className="pr-2">Download PDF or Print</span>
            <DownloadIcon aria-hidden="true" className="w-5" />
          </button>
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
                  {charge.status === 'succeeded' ? 'Paid' : 'Pending'}
                </strong>
              </div>
              <div className="pt-12">
                <h2 className="mb-2 text-xs uppercase text-gray-500">
                  Invoice For
                </h2>
                <div>
                  {charge.billing_details.name}
                  <br />
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
                      className="form-textarea mt-4 h-full w-full rounded-md border-2 border-cyan-500 bg-gray-50 p-3 placeholder-gray-700 print:hidden print:border-none print:bg-transparent print:p-0"
                      value={invoiceMetadata}
                      onChange={(e) => setInvoiceMetadata(e.target.value)}
                      placeholder="Enter additional info here (optional)"
                    />
                    <div className="hidden print:block">{invoiceMetadata}</div>
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
                {bulkCoupon ? (
                  <tr className="table-row">
                    <td>{product.name}</td>
                    <td>
                      {charge.currency.toUpperCase()}{' '}
                      {formatUsd(charge.amount / 100 / bulkCoupon.maxUses)}
                    </td>
                    <td>{bulkCoupon.maxUses}</td>
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
      </main>
    </Layout>
  )
}

export default Invoice
