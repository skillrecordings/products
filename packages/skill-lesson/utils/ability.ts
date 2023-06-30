import {
  type MongoAbility,
  createMongoAbility,
  type CreateAbility,
  AbilityBuilder,
} from '@casl/ability'
import {type SanityDocument} from '@sanity/client'
import z from 'zod'
import {hasAvailableSeats, hasBulkPurchase} from '@skillrecordings/ability'

import {type Lesson} from '../schemas/lesson'

export const UserSchema = z.object({
  role: z.string().optional(),
  purchases: z.array(z.any()).optional(),
  id: z.string().optional(),
  name: z.nullable(z.string().optional()),
  email: z.string().optional(),
})

export type User = z.infer<typeof UserSchema>

type Abilities =
  | ['view', 'Content']
  | ['invite', 'Team']
  | ['edit', 'User' | User]
  | ['view', 'Team']
  | ['view', 'Invoice']
  | ['create', 'Content']
  | ['view', 'RegionRestriction']
export type AppAbility = MongoAbility<Abilities>

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

type ViewerAbilityInput = {
  user?: User
  subscriber?: any
  lesson?: Lesson
  module?: SanityDocument
  section?: SanityDocument
  isSolution?: boolean
  country?: string
  purchasedModules?: {
    productId: string
    modules: {_id: string; slug: string}[]
  }[]
}

const canViewTutorial = ({user, subscriber, module}: ViewerAbilityInput) => {
  const contentIsTutorial = module?.moduleType === 'tutorial'
  const viewer = user || subscriber
  const emailIsNotRequiredToWatch =
    process.env.NEXT_PUBLIC_TUTORIALS_EMAIL_NOT_REQUIRED === 'true'

  return (contentIsTutorial && Boolean(viewer)) || emailIsNotRequiredToWatch
}

const canViewTip = ({lesson}: ViewerAbilityInput) => {
  const contentIsTip = lesson?._type === 'tip'

  return contentIsTip
}

const canViewTalk = ({lesson}: ViewerAbilityInput) => {
  const contentIsTalk = lesson?._type === 'talk'

  return contentIsTalk
}

const canViewWorkshop = ({
  user,
  module,
  lesson,
  country,
  purchasedModules = [],
}: ViewerAbilityInput) => {
  const contentIsWorkshop =
    module?.moduleType === 'workshop' || module?.moduleType === 'bonus'

  if (!contentIsWorkshop || !lesson) {
    return false
  }

  const modulePurchase = purchasedModules
    .filter((purchasedModule) => {
      return (
        purchasedModule.productId &&
        purchasedModule.modules.some((m) => {
          return m._id === module?._id
        })
      )
    })
    .flatMap((purchasedModule) => {
      return user?.purchases?.filter((purchase) => {
        return purchase.productId === purchasedModule.productId
      })
    })

  const userHasPurchaseWithAccess = Boolean(
    modulePurchase.find((purchase) => {
      return (
        (purchase?.bulkCouponId === null && purchase?.status === 'Valid') ||
        (purchase?.status === 'Restricted' &&
          purchase?.country === country &&
          module.moduleType !== 'bonus')
      )
    }),
  )

  return userHasPurchaseWithAccess

  // TODO a given module is associated with a product
  //  if the user has a valid purchase of that product
  //  they can view the content of the lesson
  // if (hasValidPurchase(user?.purchases)) {
  //   can('view', 'Account')
  //   can('view', 'Content')
  //   can('view', 'Product', {
  //     productId: {
  //       $in: user?.purchases?.map(
  //         (purchase: any) => purchase.productId && purchase.status === 'Valid',
  //       ),
  //     },
  //   })
  // }
}

/**
 * The first lesson is free to view for anyone
 */
const isFreelyVisible = ({
  module,
  section,
  lesson,
  isSolution,
}: ViewerAbilityInput) => {
  const lessons = section ? section.lessons : module?.lessons || []
  const isFirstLesson =
    (lesson?._type === 'exercise' ||
      lesson?._type === 'explainer' ||
      lesson?._type === 'lesson') &&
    lesson._id === lessons[0]._id

  return isFirstLesson && lesson && !isSolution
}

export function hasChargesForPurchases(purchases?: any[]) {
  return purchases?.some((purchase) => Boolean(purchase.merchantChargeId))
}

export function defineRulesForPurchases(
  viewerAbilityInput: ViewerAbilityInput,
) {
  const {can, rules} = new AbilityBuilder<AppAbility>(createMongoAbility)
  const {user, country, purchasedModules = [], module} = viewerAbilityInput

  if (user) {
    can('edit', 'User', {
      id: user?.id,
    })
  }

  if (user && module && purchasedModules) {
    const modulePurchase = purchasedModules
      .filter((purchasedModule) =>
        purchasedModule.modules.some((m) => m._id === module?._id),
      )
      .flatMap((purchasedModule) => {
        return user?.purchases?.filter(
          (purchase) => purchase.productId === purchasedModule.productId,
        )
      })

    const userHasPurchaseWithAccess = modulePurchase.map((purchase) => {
      if (purchase?.bulkCouponId !== null) {
        return {valid: false, reason: 'bulk_purchase'}
      }

      if (purchase.status === 'Restricted' && purchase.country !== country) {
        return {valid: false, reason: 'region_restricted'}
      }

      if (purchase.status === 'Restricted' && module.moduleType === 'bonus') {
        return {valid: false, reason: 'region_restricted'}
      }

      if (
        purchase.status === 'Valid' ||
        (purchase.status === 'Restricted' &&
          purchase.country === country &&
          module.moduleType !== 'bonus')
      ) {
        return {valid: true}
      }
      return {valid: false, reason: 'unknown'}
    })

    if (userHasPurchaseWithAccess.some((purchase) => purchase.valid)) {
      can('view', 'Content')
    }

    if (
      userHasPurchaseWithAccess.some(
        (purchase) => purchase.reason === 'region_restricted',
      )
    ) {
      can('view', 'RegionRestriction')
    }
  }

  if (hasChargesForPurchases(user?.purchases)) {
    can('view', 'Invoice')
  }

  if (hasBulkPurchase(user?.purchases)) {
    can('view', 'Team')
  }

  if (hasAvailableSeats(user?.purchases)) {
    can('invite', 'Team')
  }

  if (isFreelyVisible(viewerAbilityInput)) {
    can('view', 'Content')
  }

  if (canViewTip(viewerAbilityInput)) {
    can('view', 'Content')
  }

  if (canViewTalk(viewerAbilityInput)) {
    can('view', 'Content')
  }

  if (canViewTutorial(viewerAbilityInput)) {
    can('view', 'Content')
  }

  if (canViewWorkshop(viewerAbilityInput)) {
    can('view', 'Content')
  }

  if (['ADMIN', 'SUPERADMIN'].includes(user?.role as string)) {
    can('create', 'Content')
  }

  return rules
}

export function getCurrentAbility(
  viewerAbilityInput: ViewerAbilityInput,
): AppAbility {
  return createAppAbility(defineRulesForPurchases(viewerAbilityInput))
}
