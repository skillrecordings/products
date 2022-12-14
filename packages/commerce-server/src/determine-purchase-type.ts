import {isEmpty, sortBy} from 'lodash'
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

const {getPurchasesForUser, getPurchaseForStripeCharge} = getSdk()

type PurchaseForStripeCharge = NonNullable<
  Awaited<ReturnType<typeof getPurchaseForStripeCharge>>
>
type Purchase = Awaited<ReturnType<typeof getPurchasesForUser>>[number]
type BulkCoupon = NonNullable<Pick<Purchase, 'bulkCoupon'>['bulkCoupon']>
type BulkPurchase = Purchase & {bulkCoupon: BulkCoupon}
type BulkPurchaseData = {
  focalProduct: {
    productId: string
    focalPurchase: PurchaseForStripeCharge
    otherTeamBulkPurchases: BulkPurchase[]
    otherIndividualPurchases: Purchase[]
    focalBulkPurchaseIsChronologicallyFirst: boolean
  }
}
type IndividualPurchaseData = {
  focalProduct: {
    productId: string
    focalPurchase: PurchaseForStripeCharge
    otherIndividualPurchases: Purchase[]
  }
}

const summarizePurchases = (
  focalPurchase: PurchaseForStripeCharge,
  allUserPurchases: Purchase[],
):
  | {type: 'BULK'; data: BulkPurchaseData}
  | {type: 'INDIVIDUAL'; data: IndividualPurchaseData} => {
  // summarize only purchases whose productId's match the focal
  // purchase's productId
  const focalProductId = focalPurchase.productId

  const purchaseIsBulk = Boolean(focalPurchase.bulkCoupon?.id)

  // Summarize the purchases for this product ID
  const focalProductPurchases = allUserPurchases.filter(
    (purchase) => purchase.productId === focalProductId,
  )

  const bulkPurchases = focalProductPurchases.filter(
    (purchase): purchase is BulkPurchase => Boolean(purchase.bulkCoupon?.id),
  )

  const otherIndividualPurchases = focalProductPurchases.filter(
    (purchase) =>
      isEmpty(purchase.bulkCoupon) &&
      isEmpty(purchase.redeemedBulkCouponId) &&
      purchase.id !== focalPurchase.id,
  )

  if (purchaseIsBulk) {
    const teamBulkPurchases = bulkPurchases.filter((purchase) =>
      match(purchase.bulkCoupon.id, focalPurchase.bulkCoupon?.id),
    )
    const otherTeamBulkPurchases = teamBulkPurchases.filter(
      (purchase) => purchase.id !== focalPurchase.id,
    )

    const focalBulkPurchaseIsChronologicallyFirst =
      sortBy(teamBulkPurchases, 'createdAt')[0].id === focalPurchase.id

    return {
      type: 'BULK',
      data: {
        focalProduct: {
          productId: focalProductId,
          focalPurchase,
          otherTeamBulkPurchases,
          otherIndividualPurchases,
          focalBulkPurchaseIsChronologicallyFirst,
        },
        // data creates a bag where we can return summaries of purchases
        // for other products, etc.
      },
    }
  } else {
    return {
      type: 'INDIVIDUAL',
      data: {
        focalProduct: {
          productId: focalProductId,
          focalPurchase,
          otherIndividualPurchases,
        },
      },
    }
  }
}

type DeterminePurchaseTypeOptions = {
  checkoutSessionId: string
  prismaCtx?: Context
  stripeCtx?: StripeContext
}

export async function determinePurchaseType(
  options: DeterminePurchaseTypeOptions,
): Promise<PurchaseType> {
  const {prismaCtx, stripeCtx, ...noContextOptions} = options
  const {checkoutSessionId} = noContextOptions

  const {getUserByEmail, getPurchasesForUser, getPurchaseForStripeCharge} =
    getSdk({ctx: prismaCtx})

  try {
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
    if (!userId || !checkoutSessionPurchase?.id)
      throw new Error('Missing userId or purchase for checkout session')

    const allUserPurchases = await getPurchasesForUser(userId)

    const {type, data} = summarizePurchases(
      checkoutSessionPurchase,
      allUserPurchases,
    )

    if (type === 'BULK') {
      const {
        otherTeamBulkPurchases,
        otherIndividualPurchases,
        focalBulkPurchaseIsChronologicallyFirst,
      } = data.focalProduct

      if (
        isEmpty(otherTeamBulkPurchases) ||
        focalBulkPurchaseIsChronologicallyFirst
      ) {
        if (isEmpty(otherIndividualPurchases)) {
          // this is the first purchase, it is a new bulk coupon purchase
          return NEW_BULK_COUPON
        } else {
          // they made an individual purchase before, but are now purchasing
          // a bulk coupon, that's an upgrade to bulk
          return INDIVIDUAL_TO_BULK_UPGRADE
        }
      } else {
        // anything else at this point is a purchase of additional bulk seats
        return EXISTING_BULK_COUPON
      }
    }

    // if we've fallen through to here, we are dealing with an individual purchase
    //
    // there are more specific types of individual purchases:
    // - standard individual
    // - upgrade individual
    // - redemption
    //
    // but we'll just treat all of these as NEW_INDIVIDUAL_PURCHASE for now
    return NEW_INDIVIDUAL_PURCHASE
  } catch (e) {
    // Report this to Sentry
    return NEW_INDIVIDUAL_PURCHASE
  }
}
