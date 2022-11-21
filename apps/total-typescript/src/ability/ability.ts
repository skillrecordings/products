import {Ability, AbilityBuilder, AbilityClass} from '@casl/ability'
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

type Actions = 'manage' | 'invite' | 'view'
type Subjects =
  | 'Team'
  | 'Purchase'
  | 'Content'
  | 'Lesson'
  | 'Module'
  | 'Product'
  | 'Invoice'
  | 'Account'
  | 'all'
export type AppAbility = Ability<[Actions, Subjects]>
export const AppAbility = Ability as AbilityClass<AppAbility>

type ViewerAbilityInput = {
  user?: User
  subscriber?: any
  lesson?: Exercise
  module?: SanityDocument
  section?: SanityDocument
  isSolution?: boolean
}

type CanViewTutorial = {
  viewer: User | object
  module?: SanityDocument
}

const canViewTutorial = ({viewer, module}: CanViewTutorial) => {
  const contentIsTutorial = module?.moduleType === 'tutorial'

  return contentIsTutorial && Boolean(viewer)
}

type CanViewWorkshop = {
  user?: User
  module?: SanityDocument
  lesson?: Exercise
}

const canViewWorkshop = ({user, module, lesson}: CanViewWorkshop) => {
  const contentIsWorkshop = module?.moduleType === 'workshop'

  // TODO remove this once we have a better way to determine if a workshop is
  //  available to the user (see below)
  const userHasPurchases = Boolean(user && user.purchases.length > 0)
  const hasVideo = Boolean(lesson?.muxPlaybackId)

  return contentIsWorkshop && userHasPurchases && hasVideo

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

type IsFreelyVisible = {
  module?: SanityDocument
  section?: SanityDocument
  lesson?: Exercise
  isSolution?: boolean
}
/**
 * The first lesson is free to view for anyone
 */
const isFreelyVisible = ({
  module,
  section,
  lesson,
  isSolution,
}: IsFreelyVisible) => {
  const exercises = section ? section.exercises : module?.exercises || []

  const isFirstLesson =
    lesson?._type === 'exercise' && lesson._id === exercises[0]._id

  const hasVideo = Boolean(lesson?.muxPlaybackId)

  return isFirstLesson && hasVideo && !isSolution
}

export function defineRulesForPurchases(
  viewerAbilityInput: ViewerAbilityInput,
) {
  const {can, rules} = new AbilityBuilder(AppAbility)
  const {
    section,
    module,
    lesson,
    subscriber,
    user,
    isSolution = false,
  } = viewerAbilityInput

  if (hasBulkPurchase(user?.purchases)) {
    can('view', 'Team')
  }

  if (hasAvailableSeats(user?.purchases)) {
    can('invite', 'Team')
  }

  if (isFreelyVisible({module, section, lesson, isSolution})) {
    can('view', 'Content')
  }

  if (
    canViewTutorial({
      viewer: user || subscriber,
      module,
    })
  ) {
    can('view', 'Content')
  }

  if (canViewWorkshop({user, module, lesson})) {
    can('view', 'Content')
  }

  // adminRoles.includes(user?.role || '') && can('manage', 'all')

  return rules
}

export function getCurrentAbility(
  viewerAbilityInput: ViewerAbilityInput,
): AppAbility {
  return new AppAbility(defineRulesForPurchases(viewerAbilityInput))
}
