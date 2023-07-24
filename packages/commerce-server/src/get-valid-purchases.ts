import {Purchase} from '@prisma/client'

export const getValidPurchases = (purchases: any[]): Purchase[] => {
  return purchases.filter((purchase: Purchase) =>
    ['Valid', 'Restricted'].includes(purchase.status),
  )
}
