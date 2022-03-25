import {getCalculatedPriced} from './get-calculated-price'

test('does the math right!', async () => {
  const quantity = 5
  const discountMultiplier = 0.05
  const unitPrice = 100

  const expectedCalculatedPrice = getCalculatedPriced(
    unitPrice,
    quantity,
    discountMultiplier,
  )
  expect(expectedCalculatedPrice).toBe(75)
})
