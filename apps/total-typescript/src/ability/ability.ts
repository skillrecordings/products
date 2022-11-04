import {Ability, AbilityBuilder, AbilityClass} from '@casl/ability'
import {Exercise} from '../lib/exercises'
import {SanityDocument} from '@sanity/client'

type Actions = 'manage' | 'invite' | 'view'
type Subjects =
  | 'Team'
  | 'Purchase'
  | 'Content'
  | 'Product'
  | 'Invoice'
  | 'Account'
  | 'all'
export type AppAbility = Ability<[Actions, Subjects]>
const AppAbility = Ability as AbilityClass<AppAbility>

type ViewerAbilityInput = {
  user: any
  subscriber: any
  lesson: Exercise
  module: SanityDocument
  section?: SanityDocument
}

function defineRulesForPurchases(viewerAbilityInput: ViewerAbilityInput) {
  const {can, rules} = new AbilityBuilder(AppAbility)
  const {section, module, lesson, subscriber, user} = viewerAbilityInput

  const exercises = section ? section.exercises : module.exercises
  const isFirstLesson =
    lesson._type === 'exercise' && lesson._id === exercises?.[0]._id

  const hasVideo = Boolean(lesson.muxPlaybackId)

  if (module._type === 'tutorial') {
    if (subscriber || (!section && hasVideo)) {
      can('view', 'Content')
    }
  }

  if (isFirstLesson && hasVideo) {
    can('view', 'Content')
  }

  if (module._type === 'workshop') {
    if (user && hasVideo) {
      can('view', 'Content')
    }
  }

  return rules
}

export function getCurrentAbility(
  viewerAbilityInput: ViewerAbilityInput,
): AppAbility {
  return new AppAbility(defineRulesForPurchases(viewerAbilityInput))
}
