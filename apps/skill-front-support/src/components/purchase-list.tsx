import * as React from 'react'
import Purchase from './purchase'
import PurchaseLink from './purchase-link'

type PurchasesProps = {user: {purchased?: any[]}}

const Purchases = ({user}: PurchasesProps) => {
  const {purchased} = user

  if (!purchased) {
    return null
  }

  return (
    <>
      <h2 className="mb-2">Purchases</h2>
      {purchased.map((purchase: {guid: string; id: string; title: string}) => {
        return (
          <div
            key={purchase.guid}
            className="flex flex-col bg-gray-200 p-2 rounded mb-2"
          >
            <div className="flex justify-between flex-wrap items-baseline">
              <h3>{purchase.title}</h3>
              <PurchaseLink purchaseGuid={purchase.guid} />
            </div>
            <Purchase purchaseId={purchase.id} initialPurchase={purchase} />
          </div>
        )
      })}
    </>
  )
}

export default Purchases
