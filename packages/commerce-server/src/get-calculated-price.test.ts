import {getCalculatedPrice} from './get-calculated-price'

test('does the math right!', async () => {
  const quantity = 5
  const percentOfDiscount = 0.05
  const unitPrice = 100

  const expectedCalculatedPrice = getCalculatedPrice({
    unitPrice,
    quantity,
    percentOfDiscount,
  })

  expect(expectedCalculatedPrice).toBe(475)
})
