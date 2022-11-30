import {
  AppAbility,
  createAppAbility,
  defineRulesForPurchases,
  User,
} from './ability'
import {SanityDocument} from '@sanity/client'
import {subject} from '@casl/ability'

test('can edit profile if current user matches profile', () => {
  const user = {
    id: 'abcdedf',
    purchases: [],
  }
  const rules = defineRulesForPurchases({user})
  const ability = createAppAbility(rules)

  expect(
    ability.can(
      'edit',
      subject('User', {
        id: 'abcdedf',
        purchases: [],
      }),
    ),
  ).toBe(true)
})

test('can view tutorial content if a user exists', () => {
  const user = {
    purchases: [],
  }
  const rules = defineRulesForPurchases({user, module: mockTutorial})
  const ability = createAppAbility(rules)
  expect(ability.can('view', 'Content')).toBe(true)
})

test('can view tutorial lesson one if no user or subscriber', () => {
  const rules = defineRulesForPurchases({
    module: mockTutorial,
    lesson: mockExerciseOne,
  })
  const ability = createAppAbility(rules)
  expect(ability.can('view', 'Content')).toBe(true)
})

test('can view tutorial lesson two if subscriber', () => {
  const subscriber = {}
  const rules = defineRulesForPurchases({
    module: mockTutorial,
    lesson: mockExerciseTwo,
    subscriber,
  })
  const ability = createAppAbility(rules)
  expect(ability.can('view', 'Content')).toBe(true)
})

test('blocked second tutorial lesson if no user or subscriber exists', () => {
  const rules = defineRulesForPurchases({
    module: mockTutorial,
    lesson: mockExerciseTwo,
  })
  const ability = createAppAbility(rules)
  expect(ability.can('view', 'Content')).toBe(false)
})

test('can view workshop content if a purchase exists', () => {
  const user = {
    purchases: [
      {
        bulk: true,
        seats: 1,
      },
    ],
  }
  const rules = defineRulesForPurchases({
    user,
    module: mockWorkshop,
    lesson: mockExerciseOne,
  })
  const ability = createAppAbility(rules)
  expect(ability.can('view', 'Content')).toBe(true)
})

test('can view first workshop lesson if no purchase exists', () => {
  const user = {
    purchases: [],
  }
  const rules = defineRulesForPurchases({
    user,
    module: mockWorkshop,
    lesson: mockExerciseOne,
  })
  const ability = createAppAbility(rules)
  expect(ability.can('view', 'Content')).toBe(true)
})

test('can view first workshop lesson if no user exists', () => {
  const rules = defineRulesForPurchases({
    module: mockWorkshop,
    lesson: mockExerciseOne,
  })
  const ability = createAppAbility(rules)
  expect(ability.can('view', 'Content')).toBe(true)
})

test('blocked second workshop lesson if no purchase exists', () => {
  const user = {
    purchases: [],
  }
  const rules = defineRulesForPurchases({
    user,
    module: mockWorkshop,
    lesson: mockExerciseTwo,
  })
  const ability = createAppAbility(rules)
  expect(ability.can('view', 'Content')).toBe(false)
})

test('blocked second workshop lesson if user has a bulk purchase but havent claimed a seat for themselves', () => {
  const user = {
    purchases: [
      {
        bulkCoupon: {maxUses: 5, usedCount: 0},
      },
    ],
  }
  const rules = defineRulesForPurchases({
    user,
    module: mockWorkshop,
    lesson: mockExerciseTwo,
  })
  const ability = createAppAbility(rules)
  expect(ability.can('view', 'Content')).toBe(false)
})

test('can view workshop content with bulk purchase and claimed seat', () => {
  const user = {
    purchases: [
      {
        bulkCoupon: {maxUses: 5, usedCount: 1},
      },
    ],
  }
  const rules = defineRulesForPurchases({
    user,
    module: mockWorkshop,
    lesson: mockExerciseTwo,
  })
  const ability = createAppAbility(rules)
  expect(ability.can('view', 'Content')).toBe(true)
})

const mockExerciseOne = {
  title: 'Exercise One',
  slug: 'exercise-one',
  _type: 'exercise',
  _id: 'exercise-one',
  muxPlaybackId: '123',
  _rev: 'mock',
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
}

const mockExerciseTwo = {
  title: 'Exercise Two',
  slug: 'exercise-two',
  _type: 'exercise',
  _id: 'exercise-two',
  muxPlaybackId: '456',
  _rev: 'mock',
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
}

const mockTutorial: SanityDocument = {
  _id: 'mock-tutorial',
  _rev: 'mock',
  _type: 'module',
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
  moduleType: 'tutorial',
  exercises: [mockExerciseOne, mockExerciseTwo],
}

const mockSection: SanityDocument = {
  _id: 'mock-tutorial',
  _rev: 'mock',
  _type: 'section',
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
  exercises: [mockExerciseOne, mockExerciseTwo],
}

const mockWorkshop: SanityDocument = {
  _id: 'mock-tutorial',
  _rev: 'mock',
  _type: 'module',
  _createdAt: new Date().toISOString(),
  _updatedAt: new Date().toISOString(),
  moduleType: 'workshop',
  exercises: [mockExerciseOne, mockExerciseTwo],
}
