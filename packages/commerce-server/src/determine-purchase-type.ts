import {isEmpty} from 'lodash'
import {getSdk, Context, defaultContext} from '@skillrecordings/database'
import {Context as StripeContext} from '@skillrecordings/stripe-sdk'
import {stripeData} from './record-new-purchase'
import {
  EXISTING_BULK_COUPON,
  NEW_BULK_COUPON,
  NEW_INDIVIDUAL_PURCHASE,
  INDIVIDUAL_TO_BULK_UPGRADE,
} from '@skillrecordings/types'
import {z} from 'zod'

export const purchaseTypeSchema = z.union([
  z.literal(EXISTING_BULK_COUPON),
  z.literal(NEW_BULK_COUPON),
  z.literal(NEW_INDIVIDUAL_PURCHASE),
  z.literal(INDIVIDUAL_TO_BULK_UPGRADE),
])
export type PurchaseType = z.infer<typeof purchaseTypeSchema>

/**
 * Check that two values match without matching on two undefined values
 *
 * This is helpful when you find yourself doing a comparison like
 * `obj?.a === obj?.b`. If both values are undefined, then it resolves to
 * true. If you don't want that, then you have to guard the comparison,
 * `obj?.a && obj?.b && obj?.a === obj?.b`. This function takes care of that.
 */
const match = (
  value1: string | number | undefined,
  value2: string | number | undefined,
) => {
  return Boolean(value1 && value2 && value1 === value2)
}

type DeterminePurchaseTypeOptions = {
  checkoutSessionId: string
  prismaCtx?: Context
  stripeCtx?: StripeContext
}

export async function determinePurchaseType(
  options: DeterminePurchaseTypeOptions,
): Promise<PurchaseType | null> {
  const {prismaCtx, stripeCtx, ...noContextOptions} = options
  const {checkoutSessionId} = noContextOptions

  const {getUserByEmail, getPurchasesForUser, getPurchaseForStripeCharge} =
    getSdk({ctx: prismaCtx})

  // Grab the Stripe Charge ID associated with the completed checkout session
  // so that we can reference the associated purchase in our database.
  const purchaseInfo = await stripeData({
    checkoutSessionId: checkoutSessionId as string,
    stripeCtx,
  })
  const {email, stripeChargeId} = purchaseInfo

  const user = !!email && (await getUserByEmail(email))
  const {id: userId} = user || {}

  // Find the purchase record associated with this Stripe Checkout Session
  // (via the `stripeChargeId`).
  const checkoutSessionPurchase = await getPurchaseForStripeCharge(
    stripeChargeId,
  )

  // return early if we don't have a userId or a purchase corresponding to
  // this checkout session
  if (!userId || !checkoutSessionPurchase?.id) return null

  const allUserPurchases = await getPurchasesForUser(userId)

  const bulkPurchases = allUserPurchases.filter(
    (purchase) => purchase.bulkCoupon !== null,
  )
  const individualPurchase = allUserPurchases.find(
    (purchase) =>
      purchase.bulkCoupon === null && purchase.redeemedBulkCouponId === null,
  )

  // if the user has no bulk purchases and their only individual purchase
  // is the purchase for this checkout session, then this session's purchase
  // type is NEW_INDIVIDUAL_PURCHASE.
  if (
    isEmpty(bulkPurchases) &&
    match(individualPurchase?.id, checkoutSessionPurchase.id)
  ) {
    return NEW_INDIVIDUAL_PURCHASE
  }

  const checkoutSessionIsForFirstBulkPurchase =
    bulkPurchases.length === 1 &&
    match(bulkPurchases[0].id, checkoutSessionPurchase.id)

  // if this checkout session is for the user's first bulk purchase and
  // they already have an existing individual purchase, then this session's
  // purchase type is INDIVIDUAL_TO_BULK_UPGRADE.
  if (checkoutSessionIsForFirstBulkPurchase && individualPurchase?.id) {
    return INDIVIDUAL_TO_BULK_UPGRADE
  }

  // if this checkout session is for the user's first bulk purchase and
  // they do not have an existing individual purchase, then this session's
  // purchase type is NEW_BULK COUPON.
  if (checkoutSessionIsForFirstBulkPurchase && isEmpty(individualPurchase)) {
    return NEW_BULK_COUPON
  }

  if (
    bulkPurchases.length > 1 &&
    bulkPurchases
      .map((purchase) => purchase.id)
      .includes(checkoutSessionPurchase.id)
  ) {
    return EXISTING_BULK_COUPON
  }

  // TODO: Report the details of an unhandled scenario.
  return null
}
