import {
  calculateOptimalDiscount,
  FULL_STACK_VOL_ONE_PRODUCT_ID,
  EPIC_REACT_PRO_PRODUCT_ID,
  TESTING_JAVASCRIPT_PRODUCT_ID,
  TESTING_FUNDAMENTALS_PRODUCT_ID,
  MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID,
  PIXEL_PERFECT_TAILWIND_PRODUCT_ID,
  EPIC_REACT_PRO_V1_PRODUCT_ID,
} from './mega-bundle-discount-calculator'

describe('calculateOptimalDiscount', () => {
  test('returns TIER_0 for no purchases', () => {
    const result = calculateOptimalDiscount([])
    expect(result).toEqual({
      discountCode: 'ace70b71-0cfa-40bb-883a-799e63211fb3',
      discountPercentage: 0,
      existingValuePoints: 0,
      totalValuePoints: 100,
      valueRatio: 0,
    })
  })

  test('returns TIER_70 for value ratio > 0 and < 0.15', () => {
    const result = calculateOptimalDiscount([TESTING_FUNDAMENTALS_PRODUCT_ID]) // 5 points
    expect(result).toEqual({
      discountCode: 'megabundle-2024-70',
      discountPercentage: 70,
      existingValuePoints: 5,
      totalValuePoints: 100,
      valueRatio: 0.05,
    })
  })

  test('returns TIER_75 for value ratio >= 0.15 and < 0.3', () => {
    const result = calculateOptimalDiscount([
      TESTING_JAVASCRIPT_PRODUCT_ID,
      TESTING_FUNDAMENTALS_PRODUCT_ID,
    ]) // 15 points
    expect(result).toEqual({
      discountCode: 'megabundle-2024-75',
      discountPercentage: 75,
      existingValuePoints: 15,
      totalValuePoints: 100,
      valueRatio: 0.15,
    })
  })

  test('returns TIER_80 for value ratio >= 0.3 and < 0.5', () => {
    const result = calculateOptimalDiscount([
      FULL_STACK_VOL_ONE_PRODUCT_ID, // 35 points
    ])
    expect(result).toEqual({
      discountCode: 'megabundle-2024-80',
      discountPercentage: 80,
      existingValuePoints: 35,
      totalValuePoints: 100,
      valueRatio: 0.35,
    })
  })

  test('returns TIER_85 for value ratio >= 0.5 and < 0.7', () => {
    const result = calculateOptimalDiscount([
      FULL_STACK_VOL_ONE_PRODUCT_ID, // 35
      EPIC_REACT_PRO_PRODUCT_ID, // 20
    ]) // Total: 55 points
    expect(result).toEqual({
      discountCode: 'megabundle-2024-85',
      discountPercentage: 85,
      existingValuePoints: 55,
      totalValuePoints: 100,
      valueRatio: 0.55,
    })
  })

  test('returns TIER_90 for value ratio >= 0.7', () => {
    const result = calculateOptimalDiscount([
      FULL_STACK_VOL_ONE_PRODUCT_ID, // 35
      EPIC_REACT_PRO_PRODUCT_ID, // 20
      TESTING_JAVASCRIPT_PRODUCT_ID, // 10
      EPIC_REACT_PRO_V1_PRODUCT_ID, // 18
    ]) // Total: 83 points
    expect(result).toEqual({
      discountCode: 'megabundle-2024-90',
      discountPercentage: 90,
      existingValuePoints: 83,
      totalValuePoints: 100,
      valueRatio: 0.83,
    })
  })

  test('handles unknown product IDs gracefully', () => {
    const result = calculateOptimalDiscount([
      'unknown-product-id',
      TESTING_FUNDAMENTALS_PRODUCT_ID,
    ])
    expect(result).toEqual({
      discountCode: 'megabundle-2024-70',
      discountPercentage: 70,
      existingValuePoints: 5,
      totalValuePoints: 100,
      valueRatio: 0.05,
    })
  })

  test('handles edge case with all products', () => {
    const result = calculateOptimalDiscount([
      FULL_STACK_VOL_ONE_PRODUCT_ID,
      EPIC_REACT_PRO_PRODUCT_ID,
      TESTING_JAVASCRIPT_PRODUCT_ID,
      TESTING_FUNDAMENTALS_PRODUCT_ID,
      MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID,
      PIXEL_PERFECT_TAILWIND_PRODUCT_ID,
      EPIC_REACT_PRO_V1_PRODUCT_ID,
    ])
    expect(result).toEqual({
      discountCode: 'megabundle-2024-90',
      discountPercentage: 90,
      existingValuePoints: 100,
      totalValuePoints: 100,
      valueRatio: 1,
    })
  })
})
