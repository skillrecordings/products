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
export const REACT_COMPONENT_TESTING_WITH_VITEST_PRODUCT_ID =
  '2c475c54-2518-4cf6-a496-ec932dccfd54'
export const ADVANCED_VITEST_PATTERNS_PRODUCT_ID =
  '7ae13696-1076-4e1f-9559-4e6927db1227'

// Constants for product values (from CSV)
const PRODUCT_VALUES = {
  [FULL_STACK_VOL_ONE_PRODUCT_ID]: 32,
  [EPIC_REACT_PRO_PRODUCT_ID]: 18,
  [EPIC_REACT_PRO_V1_PRODUCT_ID]: 16,
  [TESTING_JAVASCRIPT_PRODUCT_ID]: 9,
  [MOCKING_TECHNIQUES_IN_VITEST_PRODUCT_ID]: 5,
  [PIXEL_PERFECT_TAILWIND_PRODUCT_ID]: 6,
  [TESTING_FUNDAMENTALS_PRODUCT_ID]: 4,
  [REACT_COMPONENT_TESTING_WITH_VITEST_PRODUCT_ID]: 5,
  [ADVANCED_VITEST_PATTERNS_PRODUCT_ID]: 5,
}

/**
 * Discount code constants for the megabundle promotion.
 *
 * IMPORTANT: These coupon IDs are hardcoded and must be kept in sync with the
 * actual coupon codes in the database/Stripe.
 *
 * - TIER_0: Default discount for customers with no existing purchases
 * - TIER_70-90: Progressive discounts based on existing purchase value
 *
 * To update discount codes:
 * 1. Update the coupon IDs in the DISCOUNT_CODES object below
 * 2. Ensure the discount percentages in calculateOptimalDiscount match the tier names
 * 3. Update expiry dates in the database
 * 4. Update tests in mega-bundle-discount-calculator.test.ts
 *
 * Note: When new products are added to the megabundle, update PRODUCT_VALUES
 * and recalculate TOTAL_VALUE_POINTS. This may require adjusting the value
 * ratio thresholds (0.15, 0.3, 0.5, 0.7) in calculateOptimalDiscount if it's not equal to 100.
 * When new products are added, we need to also update the inngest functions to give access to the right content.
 */
const DISCOUNT_CODES = {
  TIER_0: '9f8d2cb3-b667-47cc-80a2-839e2b75b99e',
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
 * Calculates the optimal discount tier based on existing purchases.
 *
 * The discount tier is determined by calculating the ratio of existing purchase
 * value to total possible value, then applying the appropriate discount:
 *
 * - valueRatio >= 0.7: 90% discount (TIER_90)
 * - valueRatio >= 0.5: 85% discount (TIER_85)
 * - valueRatio >= 0.3: 80% discount (TIER_80)
 * - valueRatio >= 0.15: 75% discount (TIER_75)
 * - valueRatio > 0: 70% discount (TIER_70)
 * - valueRatio === 0: 50% discount (whatever the discount is set for the sale, doesn't have to be 50%) (TIER_0 - default for new customers)
 *
 * @param {string[]} existingPurchaseProductIds - Array of product IDs the customer already owns
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
