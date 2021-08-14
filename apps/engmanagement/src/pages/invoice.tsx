import * as React from 'react'
import config from '../config'
import { useLocalStorage } from 'react-use'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { useViewer } from 'contexts/viewer-context'
import reduce from 'lodash/reduce'
import get from 'lodash/get'
import map from 'lodash/map'
import TeamInvites from 'components/team-invites'
import Layout from 'layouts'
import useLoginRequired from 'hooks/use-required-login'

const InvoiceItem = ({ purchase }: any) => {
  return (
    <tr className="table-row">
      <td>
        {purchase.title} ({format(parseISO(purchase.created_at), 'MMM do y')})
      </td>
      <td>
        USD {purchase.price / (purchase.quantity || 1)}
        .00
      </td>
      <td>{purchase.quantity || 1}</td>
      <td className="text-right">
        {purchase.price === null ? `USD 0.00` : `USD ${purchase.price}.00`}
      </td>
    </tr>
  )
}

const getTotalPrice = (purchases: any) => {
  return reduce(purchases, (totalAmount, currentPurchase) => totalAmount + currentPurchase.price, 0)
}

const Invoice: React.FunctionComponent = () => {
  const { sitePurchases, viewer } = useViewer()
  const [invoiceInfo, setInvoiceInfo] = useLocalStorage('invoice-info', '')
  const firstPurchase = get(sitePurchases, '[0]')
  const teamPurchases = sitePurchases.filter((purchase: any) => purchase.quantity > 1)
  const totalPrice = getTotalPrice(sitePurchases)
  const isVerifying = useLoginRequired()

  if (isVerifying) {
    return null
  }

  return (
    <Layout meta={{ title: 'Invoice for Pure React' }} className="print:block">
      <div className="max-w-screen-md mx-auto py-16 print:py-0">
        <TeamInvites teamPurchases={teamPurchases} />
        <div className="flex sm:flex-row flex-col items-center justify-between py-5 print:hidden">
          <h2 className="text-lg font-medium leading-tight sm:mb-0 mb-4">
            Your Invoice for {config.siteUrl}
          </h2>
          <button
            onClick={() => {
              window.print()
            }}
            className="flex items-center leading-6 px-5 py-3 rounded-md bg-black dark:bg-white dark:text-black text-white transition-colors ease-in-out duration-200"
          >
            Download PDF or Print
          </button>
        </div>
        <div className="border border-gray-200 dark:border-gray-800 print:border-none rounded-sm">
          <div className="px-10 py-16">
            <div className="grid grid-cols-3 w-full justify-between items-start">
              <div className="col-span-2 flex items-center">
                <Image
                  src="/placeholder-rect.svg"
                  alt={config.defaultTitle}
                  width={50}
                  height={50}
                />
                <span className="sm:inline-block hidden print:inline-block text-lg font-semibold ml-2">
                  {config.siteUrl}
                </span>
              </div>
              <div>
                <h5 className="uppercase text-xs mb-2 text-gray-500">From</h5>
                {config.defaultTitle} with {config.author}
                <br />
                co egghead.io LLC
                <br />
                337 Garden Oaks Blvd #97429
                <br />
                Houston, TX 77018
                <br />
                972-992-5951
              </div>
            </div>
            <div className="grid grid-cols-3 pb-64">
              <div className="col-span-2">
                <h5 className="text-2xl font-bold mb-2">Invoice</h5>
                {firstPurchase && (
                  <>
                    Invoice ID: <strong>{firstPurchase.guid}</strong>
                    <br />
                    Created:{' '}
                    <strong>{format(parseISO(firstPurchase.created_at), 'yyyy/MM/dd')}</strong>
                  </>
                )}
              </div>
              <div className="pt-13">
                <h5 className="uppercase text-xs mb-2 text-gray-500">Invoice For</h5>
                <div>
                  {viewer?.full_name}
                  <br />
                  {viewer?.email}
                </div>
                <br className="print:hidden" />
                <textarea
                  className={`form-textarea placeholder-gray-700 border border-gray-200 bg-gray-50 w-full h-full print:p-0 print:border-none print:bg-transparent ${
                    invoiceInfo ? '' : 'print:hidden'
                  }`}
                  value={invoiceInfo}
                  onChange={(e) => setInvoiceInfo(e.target.value)}
                  placeholder="Enter company info here (optional)"
                />
              </div>
            </div>
            <table className="table-auto w-full text-left">
              <thead className="table-header-group">
                <tr className="table-row">
                  <th>Description</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {map(sitePurchases, (purchase) => (
                  <InvoiceItem key={purchase.guid} purchase={purchase} />
                ))}
              </tbody>
            </table>
            <div className="flex flex-col items-end py-16">
              <div>
                <span className="mr-3">Total</span>
                <strong>USD {totalPrice}.00</strong>
              </div>
              <div className="font-bold">
                <span className="mr-3 text-lg">Amount Due</span>
                <strong>USD {totalPrice}.00</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Invoice
