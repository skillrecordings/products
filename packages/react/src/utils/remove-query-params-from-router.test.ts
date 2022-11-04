import {removeQueryParamsFromRouter} from './remove-query-params-from-router'
import {CK_SUBSCRIBER_KEY} from '@skillrecordings/config'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

test(`removes single url query param`, async () => {
  const router = {
    query: {
      module: 'zod',
      exercise: 'object',
      [CK_SUBSCRIBER_KEY]: '1234',
    },
    replace: jest.fn(),
  }
  useRouter.mockReturnValue(router)
  await removeQueryParamsFromRouter(router as any, [CK_SUBSCRIBER_KEY])
  expect(router.query).toEqual({module: 'zod', exercise: 'object'})
})

test(`removes multiple url query params`, async () => {
  const router = {
    query: {
      module: 'zod',
      exercise: 'object',
      [CK_SUBSCRIBER_KEY]: '1234',
    },
    replace: jest.fn(),
  }
  useRouter.mockReturnValue(router)
  await removeQueryParamsFromRouter(router as any, [
    CK_SUBSCRIBER_KEY,
    'exercise',
  ])
  expect(router.query).toEqual({module: 'zod'})
})
