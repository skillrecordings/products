import {AbilityBuilder, Ability} from '@casl/ability'
import {isNull, isUndefined, some} from 'lodash'
import {Coupon, Purchase} from '@prisma/client'

type Actions = 'manage' | 'invite' | 'view'
type Subjects = 'Team' | 'Purchase' | 'Content' | 'Product' | 'all'
type AppAbility = Ability<[Actions, Subjects]>

export async function getAbilityFromToken(token: any) {
  return defineAbilityFor(token)
}

export function bulkCouponHasSeats(coupon: Coupon) {
  return coupon.usedCount < coupon.maxUses
}

export function hasBulkPurchase(purchases?: any[]) {
  return some(purchases, (purchase) => {
    return !isNull(purchase.bulkCoupon)
  })
}

export function hasAvailableSeats(purchases?: any[]) {
  return some(purchases, (purchase) => {
    return (
      !isNull(purchase.bulkCoupon) && bulkCouponHasSeats(purchase.bulkCoupon)
    )
  })
}

export function hasValidPurchase(purchases?: any[]) {
  return some(purchases, (purchase) => {
    return isNull(purchase.bulkCoupon) || isUndefined(purchase.bulkCoupon)
  })
}

/**
 * @see {@link https://casl.js.org/v5/en/guide/define-rules#ability-builder-class|AbilityBuilder}
 * @param token the JWT session token from next-auth with purchases
 */
function defineAbilityFor(token: any) {
  const {can, build} = new AbilityBuilder<AppAbility>(Ability)

  console.log({token})

  if (hasAvailableSeats(token.purchases)) {
    can('invite', 'Team')
  }

  if (hasBulkPurchase(token.purchases)) {
    can('view', 'Team')
  }

  if (hasValidPurchase(token.purchases)) {
    can('view', 'Content')
    can('view', 'Product', {
      productId: {
        $in: token.purchases.map((purchase: Purchase) => purchase.productId),
      },
    })
  }

  return build()
}
