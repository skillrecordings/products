import {z} from 'zod'
import {Context, getSdk} from '@skillrecordings/database'
import type {MerchantCoupon, Purchase} from '@skillrecordings/database'
import {getPPPDiscountPercent} from './parity-coupon'

// export class MerchantCouponError extends Error {
//   constructor(message: string) {
//     super(message)
//     this.name = 'PriceFormattingError'
//   }
// }

const PrismaCtxSchema: z.ZodType<Context> = z.any()
const PurchaseSchema: z.ZodType<Purchase> = z.any()

const DetermineCouponToApplyParamsSchema = z.object({
  prismaCtx: PrismaCtxSchema,
  merchantCouponId: z.string().optional(),
  country: z.string(),
  quantity: z.number(),
  userId: z.string().optional(),
  purchaseToBeUpgraded: PurchaseSchema.nullable(),
})

type DetermineCouponToApplyParams = z.infer<
  typeof DetermineCouponToApplyParamsSchema
>

const SPECIAL_TYPE = 'special' as const
const PPP_TYPE = 'ppp' as const
const BULK_TYPE = 'bulk' as const
const NONE_TYPE = 'none' as const

// We are trying to determine:
// - what coupon is validly applied
//   - type
//   - merchantCoupon object
// - what other coupons are available
//   e.g. site-wide defaults, but PPP is available
// -

// If the coupon to be applied is PPP, but PPP is invalid, then
// return `NONE_TYPE` and `undefined` for the `appliedMerchantCoupon`

// If the applied coupon (e.g. site-wide discount) provides a greater
// discount than PPP would be able to, then we don't even offer PPP.

// If the applied coupon (e.g. site-wide discount) provides a greater
// discount than BULK would be able to, then we don't apply bulk discount.

export const determineCouponToApply = async (
  params: DetermineCouponToApplyParams,
) => {
  const {
    prismaCtx,
    merchantCouponId,
    country,
    quantity,
    userId,
    purchaseToBeUpgraded,
  } = DetermineCouponToApplyParamsSchema.parse(params)
  // TODO: What are the lookups and logic checks we can
  // skip when there is no appliedMerchantCouponId?

  const {getMerchantCoupon, getPurchasesForUser} = getSdk({ctx: prismaCtx})

  const appliedMerchantCoupon = await getMerchantCoupon({
    where: {id: merchantCouponId},
  })

  const userPurchases = await getPurchasesForUser(userId)

  // QUESTION: Should this include `applied` and `available`?
  // Then, for example, if we determine that PPP isn't valid because of
  // the quantity, then we remove PPP Coupon from both the `applied` and
  // `available` coupon result.
  const pppDetails = await getPPPDetails({
    appliedMerchantCoupon,
    country,
    quantity,
    purchaseToBeUpgraded,
    userPurchases,
    prismaCtx,
  })

  // NOTE: maybe return an 'error' result instead of throwing?
  //   if (pppDetails.status === INVALID_PPP) {
  //     // Throw coupon error and then repackage in caller as a PriceFormattingError
  //     throw new MerchantCouponError('coupon-not-valid-for-ppp')
  //   }

  let couponToApply: MerchantCoupon | null = null
  if (pppDetails.status === VALID_PPP) {
    couponToApply = pppDetails.pppCouponToBeApplied
  } else {
    couponToApply = appliedMerchantCoupon
  }

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

  return {pppDetails, appliedMerchantCoupon: couponToApply, appliedCouponType}
}

type UserPurchases = Awaited<
  ReturnType<ReturnType<typeof getSdk>['getPurchasesForUser']>
>
const UserPurchasesSchema: z.ZodType<UserPurchases> = z.any()
const MerchantCouponSchema: z.ZodType<MerchantCoupon> = z.any()
const GetPPPDetailsParamsSchema = z.object({
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
  const appliedMerchantCouponLessThanPPP = appliedMerchantCoupon
    ? appliedMerchantCoupon.percentageDiscount.toNumber() <
      expectedPPPDiscountPercent
    : true

  const pppConditionsMet =
    expectedPPPDiscountPercent > 0 &&
    quantity === 1 &&
    hasOnlyPPPDiscountedPurchases &&
    appliedMerchantCouponLessThanPPP

  // TODO: Does there actually have to be a PPP coupon available for this condition to be satisfied?
  const pppAvailable = pppConditionsMet

  // Build `details` with all kinds of intermediate stuff as part of this refactoring
  const pppApplied =
    quantity === 1 &&
    appliedMerchantCoupon?.type === 'ppp' &&
    expectedPPPDiscountPercent > 0

  const baseDetails = {
    pppApplied: false,
    pppAvailable,
    hasPurchaseWithPPP,
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
