import {
  calculateOptimalDiscount,
  FULL_STACK_VOL_ONE_PRODUCT_ID,
  EPIC_REACT_PRO_PRODUCT_ID,
  TESTING_JAVASCRIPT_PRODUCT_ID,
  TESTING_FUNDAMENTALS_PRODUCT_ID,
  MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID,
  PIXEL_PERFECT_TAILWIND_PRODUCT_ID,
  EPIC_REACT_PRO_V1_PRODUCT_ID,
  REACT_COMPONENT_TESTING_WITH_VITEST_PRODUCT_ID,
  ADVANCED_VITEST_PATTERNS_PRODUCT_ID,
} from './mega-bundle-discount-calculator'

describe('calculateOptimalDiscount', () => {
  test('returns TIER_0 for no purchases', () => {
    const result = calculateOptimalDiscount([])
    expect(result).toEqual({
      discountCode: '9f8d2cb3-b667-47cc-80a2-839e2b75b99e',
      discountPercentage: 0,
      existingValuePoints: 0,
      totalValuePoints: 100,
      valueRatio: 0,
    })
  })

  test('returns TIER_70 for value ratio > 0 and < 0.15', () => {
    const result = calculateOptimalDiscount([TESTING_FUNDAMENTALS_PRODUCT_ID]) // 4 points
    expect(result).toEqual({
      discountCode: 'megabundle-2024-70',
      discountPercentage: 70,
      existingValuePoints: 4,
      totalValuePoints: 100,
      valueRatio: 0.04,
    })
  })

  test('returns TIER_75 for value ratio >= 0.15 and < 0.3', () => {
    const result = calculateOptimalDiscount([
      TESTING_JAVASCRIPT_PRODUCT_ID, // 9
      TESTING_FUNDAMENTALS_PRODUCT_ID, // 4
      MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID, // 5
    ]) // Total: 18 points (0.18 ratio)
    expect(result).toEqual({
      discountCode: 'megabundle-2024-75',
      discountPercentage: 75,
      existingValuePoints: 18,
      totalValuePoints: 100,
      valueRatio: 0.18,
    })
  })

  test('returns TIER_80 for value ratio >= 0.3 and < 0.5', () => {
    const result = calculateOptimalDiscount([
      FULL_STACK_VOL_ONE_PRODUCT_ID, // 32 points
    ])
    expect(result).toEqual({
      discountCode: 'megabundle-2024-80',
      discountPercentage: 80,
      existingValuePoints: 32,
      totalValuePoints: 100,
      valueRatio: 0.32,
    })
  })

  test('returns TIER_85 for value ratio >= 0.5 and < 0.7', () => {
    const result = calculateOptimalDiscount([
      FULL_STACK_VOL_ONE_PRODUCT_ID, // 32
      EPIC_REACT_PRO_PRODUCT_ID, // 18
    ]) // Total: 50 points
    expect(result).toEqual({
      discountCode: 'megabundle-2024-85',
      discountPercentage: 85,
      existingValuePoints: 50,
      totalValuePoints: 100,
      valueRatio: 0.5,
    })
  })

  test('returns TIER_90 for value ratio >= 0.7', () => {
    const result = calculateOptimalDiscount([
      FULL_STACK_VOL_ONE_PRODUCT_ID, // 32
      EPIC_REACT_PRO_PRODUCT_ID, // 18
      TESTING_JAVASCRIPT_PRODUCT_ID, // 9
      EPIC_REACT_PRO_V1_PRODUCT_ID, // 16
    ]) // Total: 75 points
    expect(result).toEqual({
      discountCode: 'megabundle-2024-90',
      discountPercentage: 90,
      existingValuePoints: 75,
      totalValuePoints: 100,
      valueRatio: 0.75,
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
      existingValuePoints: 4,
      totalValuePoints: 100,
      valueRatio: 0.04,
    })
  })

  test('handles edge case with all products', () => {
    const result = calculateOptimalDiscount([
      FULL_STACK_VOL_ONE_PRODUCT_ID, // 32
      EPIC_REACT_PRO_PRODUCT_ID, // 18
      EPIC_REACT_PRO_V1_PRODUCT_ID, // 16
      TESTING_JAVASCRIPT_PRODUCT_ID, // 9
      MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID, // 5
      PIXEL_PERFECT_TAILWIND_PRODUCT_ID, // 6
      TESTING_FUNDAMENTALS_PRODUCT_ID, // 4
      REACT_COMPONENT_TESTING_WITH_VITEST_PRODUCT_ID, // 5
      ADVANCED_VITEST_PATTERNS_PRODUCT_ID, // 5
    ]) // Total: 100 points
    expect(result).toEqual({
      discountCode: 'megabundle-2024-90',
      discountPercentage: 90,
      existingValuePoints: 100,
      totalValuePoints: 100,
      valueRatio: 1,
    })
  })
})
