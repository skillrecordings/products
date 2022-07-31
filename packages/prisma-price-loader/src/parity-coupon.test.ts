import {getPPPDiscountPercent} from './parity-coupon'

test('get error message from error instance', () => {
  const discountPercent = getPPPDiscountPercent('US')

  expect(discountPercent).toBe(0)
})

test('get error message from error instance', () => {
  const discountPercent = getPPPDiscountPercent('IN')

  expect(discountPercent).toBe(0.75)
})
