import {AbilityBuilder, Ability, AbilityClass} from '@casl/ability'
import {
  hasAvailableSeats,
  hasBulkPurchase,
  hasValidPurchase,
  hasInvoice,
} from '../utils/purchase-validators'
import {PurchaseStatus} from '../utils/purchase-status'

type Actions = 'manage' | 'invite' | 'view' | 'edit'
type Subjects =
  | 'Team'
  | 'Purchase'
  | 'Content'
  | 'Product'
  | 'Invoice'
  | 'Account'
  | 'all'
type AppAbility = Ability<[Actions, Subjects]>
const AppAbility = Ability as AbilityClass<AppAbility>

type ViewerAbilityInput = {
  purchases?: any[]
  role?: string
}

/**
 * Creates an ability uses cached rules or the properties
 * to define a set of rules (purchases)
 * @param viewerAbilityInput
 */
export function getCurrentAbility(
  viewerAbilityInput: ViewerAbilityInput,
): AppAbility {
  return defineAbilityFor(viewerAbilityInput)
}

/**
 * factory to create an instance of an app ability
 * to use and determine if the viewer has access to
 * various things
 *
 * if the input has a set of rules, use those rules
 * otherwise, use the purchases and create rules
 * @see {@link https://casl.js.org/v5/en/guide/define-rules#ability-builder-class|AbilityBuilder}
 * @param viewerAbilityInput
 */
function defineAbilityFor(viewerAbilityInput: ViewerAbilityInput) {
  const rules = defineRulesForPurchases(viewerAbilityInput)

  return new AppAbility(rules)
}

/**
 * Creates a structure of rules to use in the ability from list of purchases
 *
 * @param viewerAbilityInput
 */
function defineRulesForPurchases(viewerAbilityInput: ViewerAbilityInput = {}) {
  const {purchases = [], role = 'user'} = viewerAbilityInput
  const {can, rules} = new AbilityBuilder(AppAbility)

  if (['ADMIN', 'SUPERADMIN'].includes(role)) {
    can('manage', 'all')
    can('edit', 'Content')
  }

  if (hasAvailableSeats(purchases)) {
    can('invite', 'Team')
  }

  if (hasBulkPurchase(purchases)) {
    can('view', 'Team')
    can('view', 'Account')
  }

  if (hasValidPurchase(purchases)) {
    can('view', 'Account')
    can('view', 'Content')
    can('view', 'Product', {
      productId: {
        $in: purchases?.map(
          (purchase: any) =>
            purchase.productId && purchase.status === PurchaseStatus.Valid,
        ),
      },
    })
  }

  if (hasInvoice(purchases)) {
    can('view', 'Invoice')
  }

  return rules
}
