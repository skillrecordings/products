import {buildStripeCheckoutPath} from './build-stripe-checkout-path'

test('it builds a bare bones path', async () => {
  const path = buildStripeCheckoutPath({
    productId: '123',
    bulk: false,
  })

  const expectedPath =
    '/api/skill/checkout/stripe?productId=123&bulk=false&quantity=1'

  expect(path).toBe(expectedPath)
})

test('it builds a fully-loaded path', async () => {
  const path = buildStripeCheckoutPath({
    productId: '123',
    bulk: true,
    couponId: 'coupon-abc',
    quantity: 5,
    userId: 'user-45',
    upgradeFromPurchaseId: 'purchase-678',
    cancelUrl: 'http://example.com/cancel/url',
  })

  const expectedPath =
    '/api/skill/checkout/stripe?productId=123&couponId=coupon-abc&bulk=true&quantity=5&userId=user-45&upgradeFromPurchaseId=purchase-678&cancelUrl=http%3A%2F%2Fexample.com%2Fcancel%2Furl'

  expect(path).toBe(expectedPath)
})

test('it handles undefined values', () => {
  const productId = undefined
  const userId = undefined

  const path = buildStripeCheckoutPath({
    productId,
    bulk: false,
    quantity: undefined,
    userId,
  })

  // TODO: Do we want to handle an `undefined` `productId` differently?
  const expectedPath =
    '/api/skill/checkout/stripe?productId=&bulk=false&quantity=1'

  expect(path).toBe(expectedPath)
})

test('it builds a path even when bulk is undefined', () => {
  const data: boolean[] = []

  const path = buildStripeCheckoutPath({
    productId: '123',
    bulk: data[0],
  })

  const expectedPath = '/api/skill/checkout/stripe?productId=123'

  expect(path).toBe(expectedPath)
})
