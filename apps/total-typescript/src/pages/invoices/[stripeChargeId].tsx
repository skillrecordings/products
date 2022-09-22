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
      <main className="max-w-screen-md mx-auto">
        <Header customer={customer} />
        <div className="bg-white text-gray-900 rounded-t-md shadow-xl print:shadow-none">
          <div className="px-10 py-16">
            <div className="grid grid-cols-3 w-full justify-between items-start">
              <Logo />
              <From product={product} />
            </div>
            <div className="grid grid-cols-3 pb-64">
              <Metadata charge={charge} date={date} />
              <InvoiceFor customer={customer} />
            </div>
            <h2 className="sr-only">Purchase details</h2>
            <table className="table-auto w-full text-left">
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
      <NavLogo className="text-gray-800 text-2xl tracking-tight" />
    </div>
  )
}
const From: React.FC<{product: string}> = ({product}) => {
  return (
    <div>
      <h2 className="uppercase text-xs mb-2 font-semibold text-gray-500">
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
    <div className="flex md:flex-row flex-col items-center justify-between md:text-left text-center py-8 print:hidden">
      <h1 className="sm:text-3xl text-2xl font-medium leading-tight max-w-md">
        Invoice
        <div className="text-base text-gray-300">for {customer.name}</div>
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
  )
}

const Metadata: React.FC<{charge: Stripe.Charge; date: string}> = ({
  charge,
  date,
}) => {
  return (
    <div className="col-span-2">
      <p className="text-3xl font-bold pb-2">Invoice</p>
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
      <h2 className="uppercase text-xs mb-2 text-gray-600 font-semibold">
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
            className="print:hidden p-3 mt-4 form-textarea placeholder-cyan-900 border-2 border-cyan-500 rounded-md bg-cyan-50 w-full h-full print:p-0 print:border-none print:bg-transparent"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Enter additional info here (optional)"
          />
          <div className="print:block hidden">{additionalInfo}</div>
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
        <th scope="col" className="font-semibold text-right">
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
        <strong className="font-semibold text-lg">
          {charge.currency.toUpperCase()} {totalAmount}
        </strong>
      </div>
    </div>
  )
}
