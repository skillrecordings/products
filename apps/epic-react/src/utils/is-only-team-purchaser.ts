import {isEmpty} from 'lodash'

export const isOnlyTeamPurchaser = (user: any) => {
  return (
    !isEmpty(user?.purchases) &&
    user.purchases.every((purchase: any) => {
      return Boolean(purchase.bulkCouponId)
    })
  )
}
