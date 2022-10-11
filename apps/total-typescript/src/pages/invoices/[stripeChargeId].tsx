import * as React from 'react'
import {stripe} from '@skillrecordings/commerce-server'
import {DownloadIcon} from '@heroicons/react/outline'
import {NavLogo} from 'components/app/navigation'
import {first, get, isEmpty} from 'lodash'
import {useLocalStorage} from 'react-use'
import {GetServerSideProps} from 'next'
import {Stripe} from 'stripe'
import fromUnixTime from 'date-fns/fromUnixTime'
import Layout from 'components/app/layout'
import format from 'date-fns/format'
import Image from 'next/image'

export const getServerSideProps: GetServerSideProps = async ({res, query}) => {
  const {stripeChargeId} = query
  if (stripeChargeId) {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

    const charge = await stripe.charges.retrieve(stripeChargeId as string)
    if (charge.invoice) {
      const invoice = await stripe.invoices.retrieve(charge.invoice as string)
      return {
        props: {
          charge,
          invoice,
        },
      }
    }

    return {
      props: {
        charge,
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

type Customer = {
  name: string
  email: string
}

const Invoice: React.FC<{
  charge: Stripe.Charge
  invoice: Stripe.Invoice
}> = ({charge, invoice}) => {
  if (isEmpty(charge)) {
    return null
  }

  const created = charge ? fromUnixTime(charge?.created) : new Date()
  const date = format(created, 'MMMM d, y')
  const totalAmount = charge?.amount / 100
  const product = `${process.env.NEXT_PUBLIC_SITE_TITLE} w/ ${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  const customer: Customer = {
    name: get(invoice, 'customer_name') || get(charge, 'billing_details.name'),
    email:
      get(invoice, 'customer_email') || get(charge, 'billing_details.email'),
  }

  return (
    <Layout
      meta={{title: `Invoice ${charge.id}`}}
      footer={null}
      nav={null}
      className="bg-gray-800"
    >
      <main className="mx-auto max-w-screen-md">
        <Header customer={customer} />
        <div className="rounded-t-md bg-white text-gray-900 shadow-xl print:shadow-none">
          <div className="px-10 py-16">
            <div className="grid w-full grid-cols-3 items-start justify-between">
              <Logo />
              <From product={product} />
            </div>
            <div className="grid grid-cols-3 pb-64">
              <Metadata charge={charge} date={date} />
              <InvoiceFor customer={customer} />
            </div>
            <h2 className="sr-only">Purchase details</h2>
            <table className="w-full table-auto text-left">
              <LinesHeader />
              <tbody>
                {invoice ? (
                  <InvoiceLines invoice={invoice} charge={charge} />
                ) : (
                  <ProductFromCharge
                    charge={charge}
                    totalAmount={totalAmount}
                  />
                )}
              </tbody>
            </table>
            <Total charge={charge} totalAmount={totalAmount} />
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Invoice

const Logo = () => {
  return (
    <div className="col-span-2 flex items-center gap-2">
      <Image
        src={require('../../../public/assets/gem-darker.png')}
        alt=""
        width={32}
        height={32}
        quality={100}
        aria-hidden="true"
      />{' '}
      <NavLogo className="text-2xl tracking-tight text-gray-800" />
    </div>
  )
}
const From: React.FC<{product: string}> = ({product}) => {
  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold uppercase text-gray-500">
        From
      </h2>
      <span className="font-semibold">{product}</span>
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
  )
}

const Header: React.FC<{customer: Customer}> = ({customer}) => {
  return (
    <div className="flex flex-col items-center justify-between py-8 text-center print:hidden md:flex-row md:text-left">
      <h1 className="max-w-md text-2xl font-medium leading-tight sm:text-3xl">
        Invoice
        <div className="text-base text-gray-300">for {customer.name}</div>
      </h1>
      <button
        onClick={() => {
          window.print()
        }}
        className="my-4 flex items-center rounded-md bg-gray-600 px-5 py-3 text-sm font-semibold leading-6 text-white transition-colors duration-200 ease-in-out hover:bg-gray-700"
      >
        <span className="pr-2">Download PDF or Print</span>
        <DownloadIcon aria-hidden="true" className="w-5" />
      </button>
    </div>
  )
}

const Metadata: React.FC<{charge: Stripe.Charge; date: string}> = ({
  charge,
  date,
}) => {
  return (
    <div className="col-span-2">
      <p className="pb-2 text-3xl font-bold">Invoice</p>
      Invoice ID: <strong className="font-semibold">{charge.id}</strong>
      <br />
      Created: <strong className="font-semibold">{date}</strong>
      <br />
      Status:{' '}
      <strong className="font-semibold">
        {charge.status === 'succeeded' ? 'Paid' : 'Pending'}
      </strong>
    </div>
  )
}

const InvoiceFor: React.FC<{customer: Customer}> = ({customer}) => {
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const [additionalInfo, setAdditionalInfo] = useLocalStorage(
    'invoice-info',
    '',
  )
  return (
    <div className="pt-12">
      <h2 className="mb-2 text-xs font-semibold uppercase text-gray-600">
        Invoice For
      </h2>
      <div>
        {customer.name}
        <br />
        {customer.email}
      </div>
      {hasMounted && (
        <>
          <textarea
            aria-label="Additional info"
            className="form-textarea mt-4 h-full w-full rounded-md border-2 border-cyan-500 bg-cyan-50 p-3 placeholder-cyan-900 print:hidden print:border-none print:bg-transparent print:p-0"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Enter additional info here (optional)"
          />
          <div className="hidden print:block">{additionalInfo}</div>
        </>
      )}
    </div>
  )
}

const LinesHeader: React.FC = () => {
  return (
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
        <th scope="col" className="text-right font-semibold">
          Amount
        </th>
      </tr>
    </thead>
  )
}

const InvoiceLines: React.FC<{
  invoice: Stripe.Invoice
  charge: Stripe.Charge
}> = ({invoice, charge}) => {
  return (
    <>
      {invoice?.lines.data.map((product: Stripe.InvoiceLineItem) => {
        const amount =
          Number(
            Number(product.price?.unit_amount) -
              Number(get(first(product.discount_amounts), 'amount')),
          ) / 100

        return (
          <tr className="table-row">
            <td>{product.description}</td>
            <td>
              {charge.currency.toUpperCase()} {amount}
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
    </>
  )
}

const ProductFromCharge: React.FC<{
  charge: Stripe.Charge
  totalAmount: number
}> = ({charge, totalAmount}) => {
  return (
    <>
      <tr className="table-row">
        <td>Total TypeScript w/ Matt Pocock</td>
        <td>
          {charge.currency.toUpperCase()} {totalAmount}
        </td>
        <td>1</td>
        <td className="text-right">
          {charge.currency.toUpperCase()} {totalAmount}
        </td>
      </tr>
    </>
  )
}

const Total: React.FC<{charge: Stripe.Charge; totalAmount: number}> = ({
  charge,
  totalAmount,
}) => {
  return (
    <div className="flex flex-col items-end py-16">
      <div>
        <span className="mr-3">Total</span>
        <strong className="text-lg font-semibold">
          {charge.currency.toUpperCase()} {totalAmount}
        </strong>
      </div>
    </div>
  )
}
