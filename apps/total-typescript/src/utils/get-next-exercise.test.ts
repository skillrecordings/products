import {getNextExercise} from './get-next-exercise'
import {Exercise} from 'lib/exercises'

test(`gets correct next exercise in tutorial`, async () => {
  const mockCurrentResource = {
    _id: 'd98c38a3-f5ee-4040-b55b-073be3a41fd1',
    _key: 'ff6fab3e7d1f',
    slug: 'object',
    solution: {
      _key: 'ff6fab3e7d1f',
      slug: 'object-solution',
    },
  }
  const nextExercise = getNextExercise(
    mockTutorial as any,
    mockCurrentResource as Exercise,
  )

  expect(nextExercise).toEqual({
    _id: 'ae955964-db6d-44b9-857e-35a0dbbba490',
    slug: 'array',
    solution: {
      _key: '78e7b5c6c9ee',
      slug: 'array-solution',
    },
  })
})

test(`last resource doesn't have next exercise`, async () => {
  const mockCurrentResource = {
    _key: '73fa7ba04eca',
    slug: 'transform-solution',
  }

  const nextExercise = getNextExercise(
    mockTutorial as any,
    mockCurrentResource as Exercise,
  )
  expect(nextExercise).toBeUndefined()
})

const mockTutorial = {
  _id: 'e607fabb-d959-4753-981f-0fa06392c5a6',
  exercises: [
    {
      _id: 'd1dc3af9-83dd-45b5-90bd-80e91d17d5ce',
      slug: 'number',
      solution: {
        _key: 'cf3c3ce897e3',
        slug: 'number-solution',
      },
    },
    {
      _id: 'd98c38a3-f5ee-4040-b55b-073be3a41fd1',
      slug: 'object',
      solution: {
        _key: 'ff6fab3e7d1f',
        slug: 'object-solution',
      },
    },
    {
      _id: 'ae955964-db6d-44b9-857e-35a0dbbba490',
      slug: 'array',
      solution: {
        _key: '78e7b5c6c9ee',
        slug: 'array-solution',
      },
    },
    {
      _id: '0b3d644c-03ca-42d4-9051-88ad75a2b8f6',
      slug: 'infer',
      solution: {
        _key: '812fbe1ab585',
        slug: 'infer-solution',
      },
    },
    {
      _id: '8e6d031f-e191-410e-900a-bbe07fb38291',
      slug: 'optional',
      solution: {
        _key: '2737ce9ae873',
        slug: 'optional-solution',
      },
    },
    {
      _id: '0f54254e-d4dc-4876-a279-10f78161376c',
      slug: 'default',
      solution: {
        _key: '6c6c74412f99',
        slug: 'default-solution',
      },
    },
    {
      _id: '090f3fde-1563-4d88-a862-d99ba6a11462',
      slug: 'union',
      solution: {
        _key: '610735fa46bc',
        slug: 'union-solution',
      },
    },
    {
      _id: '987beb68-9be7-43b7-8196-ad973f19cf64',
      slug: 'validations',
      solution: {
        _key: 'b221ab0115dc',
        slug: 'validations-solution',
      },
    },
    {
      _id: '3cd26fea-773f-41ae-b19a-2f1e590a63f1',
      slug: 'composing-objects',
      solution: {
        _key: 'f8d55b85d9de',
        slug: 'composing-objects-solution',
      },
    },
    {
      _id: '8adc3375-bdc3-4637-808a-56ad6e4ad8fa',
      slug: 'transform',
      solution: {
        _key: '73fa7ba04eca',
        slug: 'transform-solution',
      },
    },
  ],
}
