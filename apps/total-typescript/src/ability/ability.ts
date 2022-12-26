import {
  MongoAbility,
  createMongoAbility,
  CreateAbility,
  AbilityBuilder,
} from '@casl/ability'
import {Exercise} from '../lib/exercises'
import {SanityDocument} from '@sanity/client'
import z from 'zod'
import {hasAvailableSeats, hasBulkPurchase} from '@skillrecordings/ability'

export const UserSchema = z.object({
  role: z.string().optional(),
  purchases: z.array(z.any()),
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
export type AppAbility = MongoAbility<Abilities>

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

type ViewerAbilityInput = {
  user?: User
  subscriber?: any
  lesson?: Exercise
  module?: SanityDocument
  section?: SanityDocument
  isSolution?: boolean
}

const canViewTutorial = ({user, subscriber, module}: ViewerAbilityInput) => {
  const contentIsTutorial = module?.moduleType === 'tutorial'
  const viewer = user || subscriber

  return contentIsTutorial && Boolean(viewer)
}

const canViewWorkshop = ({user, module, lesson}: ViewerAbilityInput) => {
  const contentIsWorkshop = module?.moduleType === 'workshop'

  const purchases = user?.purchases || []
  const userHasPurchaseWithAccess = Boolean(
    purchases.find((purchase) => purchase.bulkCouponId === null),
  )

  const hasVideo = Boolean(lesson?.muxPlaybackId)

  return contentIsWorkshop && userHasPurchaseWithAccess && hasVideo

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
  const exercises = section ? section.exercises : module?.exercises || []

  const isFirstLesson =
    lesson?._type === 'exercise' && lesson._id === exercises[0]._id

  const hasVideo = Boolean(lesson?.muxPlaybackId)

  return isFirstLesson && hasVideo && !isSolution
}

export function hasChargesForPurchases(purchases?: any[]) {
  return purchases?.some((purchase) => Boolean(purchase.merchantChargeId))
}

export function defineRulesForPurchases(
  viewerAbilityInput: ViewerAbilityInput,
) {
  const {can, rules} = new AbilityBuilder<AppAbility>(createMongoAbility)
  const {user} = viewerAbilityInput

  if (user) {
    can('edit', 'User', {
      id: user?.id,
    })
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

  if (canViewTutorial(viewerAbilityInput)) {
    can('view', 'Content')
  }

  if (canViewWorkshop(viewerAbilityInput)) {
    can('view', 'Content')
  }

  return rules
}

export function getCurrentAbility(
  viewerAbilityInput: ViewerAbilityInput,
): AppAbility {
  return createAppAbility(defineRulesForPurchases(viewerAbilityInput))
}
