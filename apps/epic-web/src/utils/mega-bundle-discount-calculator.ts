export const FULL_STACK_VOL_ONE_PRODUCT_ID =
  'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002'
export const TESTING_JAVASCRIPT_PRODUCT_ID =
  'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5'
export const EPIC_REACT_PRO_V1_PRODUCT_ID =
  'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38'
export const EPIC_REACT_PRO_PRODUCT_ID = 'kcd_product-clzlrf0g5000008jm0czdanmz'
export const PIXEL_PERFECT_TAILWIND_PRODUCT_ID =
  '1b6e7ed6-8a15-48f1-8dd7-e76612581ee8'
export const MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID =
  'f3f85931-e67e-456f-85c4-eec95a0e4ddd'
export const TESTING_FUNDAMENTALS_PRODUCT_ID =
  '7872d512-ba34-4108-b510-7db9cbcee98c'

// Constants for product values (from CSV)
const PRODUCT_VALUES = {
  [FULL_STACK_VOL_ONE_PRODUCT_ID]: 35,
  [EPIC_REACT_PRO_PRODUCT_ID]: 20,
  [TESTING_JAVASCRIPT_PRODUCT_ID]: 10,
  [TESTING_FUNDAMENTALS_PRODUCT_ID]: 5,
  [MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID]: 6,
  [PIXEL_PERFECT_TAILWIND_PRODUCT_ID]: 6,
  [EPIC_REACT_PRO_V1_PRODUCT_ID]: 18,
}

// Discount code constants
const DISCOUNT_CODES = {
  TIER_0: 'ace70b71-0cfa-40bb-883a-799e63211fb3',
  TIER_70: 'megabundle-2024-70',
  TIER_75: 'megabundle-2024-75',
  TIER_80: 'megabundle-2024-80',
  TIER_85: 'megabundle-2024-85',
  TIER_90: 'megabundle-2024-90',
}

// Total possible value points
const TOTAL_VALUE_POINTS = Object.values(PRODUCT_VALUES).reduce(
  (sum, value) => sum + value,
  0,
)

/**
 * Calculates the optimal discount tier based on existing purchases
 * @param {string[]} existingPurchases - Array of product names the customer already owns
 * @returns {{
 *   discountCode: string,
 *   discountPercentage: number,
 *   existingValuePoints: number,
 *   totalValuePoints: number,
 *   valueRatio: number
 * }}
 */
export function calculateOptimalDiscount(existingPurchaseProductIds: string[]) {
  // Calculate total value points from existing purchases
  const existingValuePoints = existingPurchaseProductIds.reduce(
    (sum, productId) => {
      // @ts-expect-error
      const productValue = PRODUCT_VALUES[productId]
      return sum + (productValue || 0)
    },
    0,
  )

  // Calculate ratio of existing value to total possible value
  const valueRatio = existingValuePoints / TOTAL_VALUE_POINTS

  // Determine discount tier based on value ratio
  if (valueRatio >= 0.7) {
    return {
      discountCode: DISCOUNT_CODES.TIER_90,
      discountPercentage: 90,
      existingValuePoints,
      totalValuePoints: TOTAL_VALUE_POINTS,
      valueRatio,
    }
  } else if (valueRatio >= 0.5) {
    return {
      discountCode: DISCOUNT_CODES.TIER_85,
      discountPercentage: 85,
      existingValuePoints,
      totalValuePoints: TOTAL_VALUE_POINTS,
      valueRatio,
    }
  } else if (valueRatio >= 0.3) {
    return {
      discountCode: DISCOUNT_CODES.TIER_80,
      discountPercentage: 80,
      existingValuePoints,
      totalValuePoints: TOTAL_VALUE_POINTS,
      valueRatio,
    }
  } else if (valueRatio >= 0.15) {
    return {
      discountCode: DISCOUNT_CODES.TIER_75,
      discountPercentage: 75,
      existingValuePoints,
      totalValuePoints: TOTAL_VALUE_POINTS,
      valueRatio,
    }
  } else if (valueRatio > 0) {
    return {
      discountCode: DISCOUNT_CODES.TIER_70,
      discountPercentage: 70,
      existingValuePoints,
      totalValuePoints: TOTAL_VALUE_POINTS,
      valueRatio,
    }
  } else {
    return {
      discountCode: DISCOUNT_CODES.TIER_0,
      discountPercentage: 0,
      existingValuePoints,
      totalValuePoints: TOTAL_VALUE_POINTS,
      valueRatio,
    }
  }
}
