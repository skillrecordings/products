import {isEmpty} from 'lodash'
import {prisma, getSdk} from '@skillrecordings/database'
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

const match = (
  value1: string | number | undefined,
  value2: string | number | undefined,
) => {
  return Boolean(value1 && value2 && value1 === value2)
}

export async function determinePurchaseType(
  checkoutSessionId: string,
): Promise<PurchaseType | null> {
  // Grab the Stripe Charge ID associated with the completed checkout session
  // so that we can reference the associated purchase in our database.
  const purchaseInfo = await stripeData(checkoutSessionId as string)
  const {email, stripeChargeId} = purchaseInfo

  const user = !!email && (await getSdk().getUserByEmail(email))
  const {id: userId} = user || {}

  // Find the purchase record associated with this Stripe Checkout Session
  // (via the `stripeChargeId`).
  const checkoutSessionPurchase = await prisma.purchase.findFirst({
    where: {
      merchantCharge: {
        identifier: stripeChargeId,
      },
    },
    include: {
      bulkCoupon: {
        include: {
          bulkCouponPurchases: true,
        },
      },
    },
  })

  // return early if we don't have a userId or a purchase corresponding to
  // this checkout session
  if (!userId || !checkoutSessionPurchase?.id) return null

  const allUserPurchases = await getSdk().getPurchasesForUser(userId)

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
