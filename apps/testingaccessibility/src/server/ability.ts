import {AbilityBuilder, Ability, defineAbility} from '@casl/ability'
import {intersection, isNull, isString, some} from 'lodash'
import {Purchase} from '@prisma/client'

type Actions = 'manage' | 'invite' | 'view'
type Subjects = 'Team' | 'Purchase' | 'Content' | 'Product' | 'all'
type AppAbility = Ability<[Actions, Subjects]>

export async function getAbilityFromToken(token: any) {
  return defineAbilityFor(token)
}

export function hasValidBulkPurchase(purchases?: any[]) {
  return some(purchases, (purchase) => {
    return !isNull(purchase.bulkCoupon)
  })
}

export function hasValidPurchase(purchases?: any[]) {
  return some(purchases, (purchase) => {
    return isNull(purchase.bulkCoupon)
  })
}

/**
 * @see {@link https://casl.js.org/v5/en/guide/define-rules#ability-builder-class|AbilityBuilder}
 * @param viewerRoles an array of roles for the current viewer
 */
function defineAbilityFor(token: any) {
  const {can, build} = new AbilityBuilder<AppAbility>(Ability)

  if (hasValidBulkPurchase(token.purchases)) {
    can('invite', 'Team')
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
