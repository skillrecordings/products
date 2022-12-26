import FrontLink from './front-link'
import * as React from 'react'

const PurchaseLink = ({
  purchaseGuid,
  children = 'Purchase Details',
}: {
  purchaseGuid: string
  children?: React.ReactNode
}) => {
  const purchaseUrl = `https://app.egghead.io/admin/purchases/${purchaseGuid}`
  return <FrontLink href={purchaseUrl}>{children}</FrontLink>
}

export default PurchaseLink
