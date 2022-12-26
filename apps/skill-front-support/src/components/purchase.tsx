import axios from 'axios'
import {get} from 'lodash'
import * as React from 'react'
import PurchaseLink from './purchase-link'
import PurchaserLinks from './purchaser-links'

const Purchase = ({
  purchaseId,
  initialPurchase,
}: {
  purchaseId: string
  initialPurchase: any
}) => {
  const [purchase, setPurchase] = React.useState<any>(initialPurchase)
  const coupon = get(purchase, 'coupon')
  return (
    <div key={purchase.guid} className="text-xs text-gray-600 ">
      <h3 className="mt-2">Purchase Data</h3>
      <div className="flex justify-between">
        <span className="text-gray-800">Guid</span>
        <span>{purchase.guid}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-800">State</span>
        <span>{purchase.purchase_state || `unknown`}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-800">Price</span>
        <span>${purchase.price}</span>
      </div>
      {coupon && (
        <>
          <h3 className="mt-2">Coupon Data</h3>
          <div className="flex justify-between flex-wrap">
            <span className="text-gray-800">Percent Off</span>
            <span>{Math.floor(coupon.percent_off * 100) || '0'}%</span>
          </div>
          <div className="flex justify-between flex-wrap">
            <span className="text-gray-800">Code</span>
            <span>{coupon.code}</span>
          </div>
          {coupon.restricted_to_country_name && (
            <div className="flex justify-between flex-wrap">
              <span className="text-gray-800">PPP Country</span>
              <span>{coupon.restricted_to_country_name}</span>
            </div>
          )}
        </>
      )}
      {purchase.parent_purchase && (
        <div className="mt-2">
          <h3>Part of a Bulk Purchase ({purchase.parent_purchase.quantity})</h3>
          <PurchaseLink purchaseGuid={purchase.parent_purchase.guid} />
          <PurchaserLinks email={purchase.parent_purchase.purchased_by_email} />
          <div className="grid grid-cols-8 mt-1 justify-items-end">
            <div className="text-gray-800 col-start-0 col-span-2 justify-self-start">
              Purchased By
            </div>
            <div className="col-start-4 row-start-0 col-span-5">
              {purchase.parent_purchase.purchased_by_email}
            </div>
          </div>
          <div className="grid grid-cols-8 mt-1 justify-items-end">
            {purchase.parent_purchase.claimed_sellables && (
              <div className="text-gray-800 col-start-0 col-span-2 justify-self-start">
                Claimed by
              </div>
            )}
            {purchase.parent_purchase.claimed_sellables.map(
              (sellable: {claimed_by_email: string}, index: number) => {
                return (
                  <div className={`col-start-4 row-start-${index} col-span-5`}>
                    {sellable.claimed_by_email}
                  </div>
                )
              },
            )}
          </div>
        </div>
      )}
      {purchase.bulk && (
        <div className="mt-2">
          <h3>Bulk Purchase ({purchase.quantity})</h3>
          <PurchaseLink purchaseGuid={purchase.guid} />
          <div className="grid grid-cols-8 mt-1 justify-items-end">
            {purchase.claimed_sellables && (
              <div className="text-gray-800 col-start-0 col-span-2 self-start">
                Claimed by
              </div>
            )}
            {purchase.claimed_sellables.map(
              (sellable: {claimed_by_email: string}, index: number) => {
                return (
                  <div className={`col-start-4 row-start-${index} col-span-5`}>
                    {sellable.claimed_by_email}
                  </div>
                )
              },
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Purchase
