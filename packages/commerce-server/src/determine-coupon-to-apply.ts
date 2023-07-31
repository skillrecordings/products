import {z} from 'zod'
import {Context, getSdk} from '@skillrecordings/database'
import type {MerchantCoupon, Purchase} from '@skillrecordings/database'
import {getPPPDiscountPercent} from './parity-coupon'
import {getBulkDiscountPercent} from './bulk-coupon'
import type {MinimalMerchantCoupon} from './@types'

const PrismaCtxSchema: z.ZodType<Context> = z.any()
const PurchaseSchema: z.ZodType<Purchase> = z.any()

const DetermineCouponToApplyParamsSchema = z.object({
  prismaCtx: PrismaCtxSchema,
  merchantCouponId: z.string().optional(),
  country: z.string(),
  quantity: z.number(),
  userId: z.string().optional(),
  productId: z.string(),
  purchaseToBeUpgraded: PurchaseSchema.nullable(),
})

type DetermineCouponToApplyParams = z.infer<
  typeof DetermineCouponToApplyParamsSchema
>

const SPECIAL_TYPE = 'special' as const
const PPP_TYPE = 'ppp' as const
const BULK_TYPE = 'bulk' as const
const NONE_TYPE = 'none' as const

export const determineCouponToApply = async (
  params: DetermineCouponToApplyParams,
) => {
  const {
    prismaCtx,
    merchantCouponId,
    country,
    quantity,
    userId,
    productId,
    purchaseToBeUpgraded,
  } = DetermineCouponToApplyParamsSchema.parse(params)
  // TODO: What are the lookups and logic checks we can
  // skip when there is no appliedMerchantCouponId?

  const {getMerchantCoupon, getPurchasesForUser} = getSdk({ctx: prismaCtx})

  const candidateMerchantCoupon = await getMerchantCoupon({
    where: {id: merchantCouponId},
  })

  const specialMerchantCouponToApply =
    candidateMerchantCoupon?.type === SPECIAL_TYPE
      ? candidateMerchantCoupon
      : null

  const userPurchases = await getPurchasesForUser(userId)

  const pppDetails = await getPPPDetails({
    specialMerchantCoupon: specialMerchantCouponToApply,
    appliedMerchantCoupon: candidateMerchantCoupon,
    country,
    quantity,
    purchaseToBeUpgraded,
    userPurchases,
    prismaCtx,
  })

  const bulkDiscountDetails = await getBulkCouponDetails({
    prismaCtx,
    userId,
    productId,
    quantity,
    appliedMerchantCoupon: candidateMerchantCoupon,
    pppApplied: pppDetails.pppApplied,
  })

  let couponToApply: MinimalMerchantCoupon | null = null
  if (pppDetails.status === VALID_PPP) {
    couponToApply = pppDetails.pppCouponToBeApplied
  } else if (bulkDiscountDetails.bulkDiscountAvailable) {
    couponToApply = bulkDiscountDetails.bulkCouponToBeApplied
  } else {
    couponToApply = candidateMerchantCoupon
  }

  // It is only every PPP that ends up in the Available Coupons
  // list because with Special and Bulk we auto-apply those if
  // they are the best discount.
  const availableCoupons = pppDetails.availableCoupons

  // Narrow appliedCouponType to a union of consts
  const appliedCouponType = z
    .string()
    .nullish()
    .transform((couponType) => {
      if (couponType === PPP_TYPE) {
        return PPP_TYPE
      } else if (couponType === SPECIAL_TYPE) {
        return SPECIAL_TYPE
      } else if (couponType === BULK_TYPE) {
        return BULK_TYPE
      } else {
        return NONE_TYPE
      }
    })
    .parse(couponToApply?.type)

  return {
    pppDetails,
    bulkDiscountDetails,
    appliedMerchantCoupon: couponToApply || undefined,
    appliedCouponType,
    availableCoupons,
  }
}

type UserPurchases = Awaited<
  ReturnType<ReturnType<typeof getSdk>['getPurchasesForUser']>
>
const UserPurchasesSchema: z.ZodType<UserPurchases> = z.any()
const MerchantCouponSchema: z.ZodType<MerchantCoupon> = z.any()
const GetPPPDetailsParamsSchema = z.object({
  specialMerchantCoupon: MerchantCouponSchema.nullable(),
  appliedMerchantCoupon: MerchantCouponSchema.nullable(),
  quantity: z.number(),
  country: z.string(),
  purchaseToBeUpgraded: PurchaseSchema.nullable(),
  userPurchases: UserPurchasesSchema,
  prismaCtx: PrismaCtxSchema,
})
type GetPPPDetailsParams = z.infer<typeof GetPPPDetailsParamsSchema>

const NO_PPP = 'NO_PPP' as const
const INVALID_PPP = 'INVALID_PPP' as const
const VALID_PPP = 'VALID_PPP' as const

const getPPPDetails = async ({
  specialMerchantCoupon,
  appliedMerchantCoupon,
  country,
  quantity,
  purchaseToBeUpgraded,
  userPurchases,
  prismaCtx,
}: GetPPPDetailsParams) => {
  // TODO: Revisit exactly what this condition means, it may be
  // the case that it can be replaced with the `hasNonPPPPurchases` condition
  const hasPurchaseWithPPP = userPurchases.some(
    (purchase) =>
      purchase.status === 'Restricted' &&
      purchaseToBeUpgraded &&
      purchase.productId === purchaseToBeUpgraded?.productId,
  )

  const hasMadeNonPPPDiscountedPurchase = userPurchases.some(
    (purchase) => purchase.status === 'Valid',
  )
  const hasOnlyPPPDiscountedPurchases = !hasMadeNonPPPDiscountedPurchase

  const expectedPPPDiscountPercent = getPPPDiscountPercent(country)

  const shouldLookupPPPMerchantCouponForUpgrade =
    appliedMerchantCoupon === null &&
    purchaseToBeUpgraded !== null &&
    hasOnlyPPPDiscountedPurchases

  let pppMerchantCouponForUpgrade: MerchantCoupon | null = null
  if (shouldLookupPPPMerchantCouponForUpgrade) {
    pppMerchantCouponForUpgrade = await lookupApplicablePPPMerchantCoupon({
      prismaCtx,
      pppDiscountPercent: expectedPPPDiscountPercent,
    })
  }

  const pppCouponToBeApplied =
    (appliedMerchantCoupon?.type === PPP_TYPE && appliedMerchantCoupon) ||
    pppMerchantCouponForUpgrade

  // TODO: Move this sort of price comparison to the parent method, for the
  // purposes of this method we'll just assume that if the PPP looks
  // good and can be applied, then it is a candidate.
  const pppDiscountIsBetter =
    (specialMerchantCoupon?.percentageDiscount.toNumber() || 0) <
    expectedPPPDiscountPercent

  const pppConditionsMet =
    expectedPPPDiscountPercent > 0 &&
    quantity === 1 &&
    hasOnlyPPPDiscountedPurchases &&
    pppDiscountIsBetter

  // TODO: Does there actually have to be a PPP coupon available for this condition to be satisfied?
  const pppAvailable = pppConditionsMet

  // Build `details` with all kinds of intermediate stuff as part of this refactoring
  const pppApplied =
    quantity === 1 &&
    appliedMerchantCoupon?.type === 'ppp' &&
    expectedPPPDiscountPercent > 0

  // NOTE: PPP coupons are only *available* if the conditions are met
  // which includes that the PPP discount will be better than any
  // site-wide default coupon.
  let availableCoupons: Awaited<ReturnType<typeof couponForType>> = []
  if (pppConditionsMet) {
    availableCoupons = await couponForType(
      PPP_TYPE,
      expectedPPPDiscountPercent,
      prismaCtx,
      country,
    )
  }

  const baseDetails = {
    pppApplied: false,
    pppAvailable,
    hasPurchaseWithPPP,
    availableCoupons,
  }
  if (pppCouponToBeApplied === null) {
    return {
      ...baseDetails,
      status: NO_PPP,
    }
  }

  // Check *applied* PPP coupon validity
  const couponPercentDoesNotMatchCountry =
    expectedPPPDiscountPercent !==
    pppCouponToBeApplied.percentageDiscount.toNumber()
  const couponPercentOutOfRange =
    expectedPPPDiscountPercent <= 0 || expectedPPPDiscountPercent >= 1
  const pppAppliedToBulkPurchase = quantity > 1
  const invalidCoupon =
    couponPercentDoesNotMatchCountry ||
    couponPercentOutOfRange ||
    pppAppliedToBulkPurchase

  const details = {...baseDetails, pppApplied, pppAvailable}

  if (invalidCoupon) {
    return {
      status: INVALID_PPP,
      ...details,
      pppApplied: false,
      pppCouponToBeApplied: null,
      availableCoupons: [],
    }
  }

  return {
    status: VALID_PPP,
    ...details,
    pppCouponToBeApplied,
  }
}

const LookupApplicablePPPMerchantCouponParamsSchema = z.object({
  prismaCtx: PrismaCtxSchema,
  pppDiscountPercent: z.number(),
})
type LookupApplicablePPPMerchantCouponParams = z.infer<
  typeof LookupApplicablePPPMerchantCouponParamsSchema
>

// TODO: Should we pass in the `country` and verify that the PPP
// discount percentage for that country matches the discount we
// are about to apply?
const lookupApplicablePPPMerchantCoupon = async (
  params: LookupApplicablePPPMerchantCouponParams,
) => {
  const {prismaCtx, pppDiscountPercent} =
    LookupApplicablePPPMerchantCouponParamsSchema.parse(params)

  const {getMerchantCoupon} = getSdk({ctx: prismaCtx})
  const pppMerchantCoupon = await getMerchantCoupon({
    where: {type: PPP_TYPE, percentageDiscount: pppDiscountPercent},
  })

  // early return if there is no PPP coupon that fits the bill
  // report this to Sentry? Seems like a bug if we aren't able to find one.
  if (pppMerchantCoupon === null) return null

  // Going to skip trimming down the coupon attributes for the time being.
  //   const {identifier, merchantAccountId, ...minimalPPPMerchantCoupon} =
  //     pppMerchantCoupon

  // TODO: Mix in the `country`, seems like downstream wants the
  // `country` bundled in with the rest of the PPP coupon
  return pppMerchantCoupon
}

const GetBulkCouponDetailsParamsSchema = z.object({
  prismaCtx: PrismaCtxSchema,
  userId: z.string().optional(),
  productId: z.string(),
  quantity: z.number(),
  appliedMerchantCoupon: MerchantCouponSchema.nullable(),
  pppApplied: z.boolean(),
})
type GetBulkCouponDetailsParams = z.infer<
  typeof GetBulkCouponDetailsParamsSchema
>
const getBulkCouponDetails = async (params: GetBulkCouponDetailsParams) => {
  const {
    prismaCtx,
    userId,
    productId,
    quantity,
    appliedMerchantCoupon,
    pppApplied,
  } = GetBulkCouponDetailsParamsSchema.parse(params)

  // Determine if the user has an existing bulk purchase of this product.
  // If so, we can compute tiered pricing based on their existing seats purchased.
  const seatCount = await getQualifyingSeatCount({
    userId,
    productId,
    newPurchaseQuantity: quantity,
    prismaCtx,
  })

  const bulkCouponPercent = getBulkDiscountPercent(seatCount)

  const bulkDiscountIsBetter =
    (appliedMerchantCoupon?.percentageDiscount.toNumber() || 0) <
    bulkCouponPercent

  const bulkDiscountAvailable =
    bulkCouponPercent > 0 && bulkDiscountIsBetter && !pppApplied // this condition seems irrelevant, if quantity > 1 OR seatCount > 1

  const bulkCoupons = await couponForType(
    BULK_TYPE,
    bulkCouponPercent,
    prismaCtx,
  )
  const bulkCoupon = bulkCoupons[0]

  return {
    bulkDiscountAvailable,
    bulkCouponPercent,
    bulkCouponToBeApplied: bulkCoupon,
  }
}

const getQualifyingSeatCount = async ({
  userId,
  productId: purchasingProductId,
  newPurchaseQuantity,
  prismaCtx,
}: {
  userId: string | undefined
  productId: string
  newPurchaseQuantity: number
  prismaCtx: Context
}) => {
  const {getPurchasesForUser} = getSdk({ctx: prismaCtx})
  const userPurchases = await getPurchasesForUser(userId)
  const bulkPurchase = userPurchases.find(
    ({productId, bulkCoupon}) =>
      productId === purchasingProductId && Boolean(bulkCoupon),
  )
  const existingSeatsPurchasedForThisProduct =
    bulkPurchase?.bulkCoupon?.maxUses || 0

  return newPurchaseQuantity + existingSeatsPurchasedForThisProduct
}

async function couponForType(
  type: string,
  percentageDiscount: number,
  prismaCtx: Context,
  country?: string,
) {
  const {getMerchantCoupons} = getSdk({ctx: prismaCtx})
  const merchantCoupons =
    (await getMerchantCoupons({
      where: {type, percentageDiscount},
    })) || []

  return merchantCoupons.map((coupon: MerchantCoupon) => {
    // for pricing we don't need the identifier so strip it here
    const {identifier, ...rest} = coupon
    return {...rest, ...(country && {country})}
  })
}
