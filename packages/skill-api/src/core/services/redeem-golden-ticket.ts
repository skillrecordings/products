import {SkillRecordingsHandlerParams} from '../types'
import {OutgoingResponse} from '../index'
import {getSdk, prisma} from '@skillrecordings/database'
import {validateCoupon} from '@skillrecordings/commerce-server'

import {postRedemptionToSlack} from '../../server/post-to-slack'
import {PurchaseStatus} from '../../enums'
import {sendServerEmail} from '../../server'

export class CouponRedemptionError extends Error {
  couponId: string
  email: string
  existingPurchaseId?: string

  constructor(
    message: string,
    couponId: string,
    email: string,
    existingPurchaseId?: string,
  ) {
    super(message)
    this.name = 'CouponRedemptionError'
    this.couponId = couponId
    this.email = email
    this.existingPurchaseId = existingPurchaseId
  }
}

export async function redeemGoldenTicket({
  params,
}: {
  params: SkillRecordingsHandlerParams
}): Promise<OutgoingResponse> {
  try {
    const {
      req,
      options: {nextAuthOptions},
    } = params
    const {findOrCreateUser, getCoupon} = getSdk()

    const {email: baseEmail, couponId, sendEmail = true} = req.body

    if (!baseEmail) throw new Error(`invaild-email-${baseEmail}`)

    // something in the chain strips out the plus and leaves a space
    const email = String(baseEmail).replace(' ', '+')

    const coupon = await getCoupon({
      where: {id: couponId},
    })

    const couponValidation = validateCoupon(coupon)

    if (coupon && couponValidation.isValid) {
      const bulkCouponRedemption = coupon.maxUses > 1

      const {user} = await findOrCreateUser(email)

      if (!user)
        throw new CouponRedemptionError(
          `unable-to-create-user-${email}`,
          couponId as string,
          email,
        )

      const productId =
        (coupon.restrictedToProductId as string) ||
        process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID

      // To prevent double-purchasing, check if this user already has a
      // Purchase record for this product that is valid and wasn't a bulk
      // coupon purchase.
      const existingPurchase = await prisma.purchase.findFirst({
        where: {
          userId: user.id,
          productId,
          bulkCouponId: null,
          status: PurchaseStatus.Valid,
        },
        select: {
          id: true,
        },
      })

      if (existingPurchase)
        throw new CouponRedemptionError(
          `already-purchased-${email}`,
          couponId as string,
          email,
          existingPurchase.id,
        )

      const createPurchase = prisma.purchase.create({
        data: {
          userId: user.id,
          redeemedBulkCouponId: bulkCouponRedemption ? coupon.id : null,
          productId,
          totalAmount: 0,
        },
      })

      const updateCouponUsage = prisma.coupon.update({
        where: {id: coupon.id},
        data: {
          usedCount: {
            increment: 1,
          },
        },
      })

      // To ensure consistency when "redeeming a coupon", we use a DB
      // transaction to create the purchase record and update the coupon's
      // usage count atomically.
      const [purchase, _coupon] = await prisma.$transaction([
        createPurchase,
        updateCouponUsage,
      ])

      if (sendEmail && nextAuthOptions) {
        await sendServerEmail({
          email: user.email,
          callbackUrl: `${process.env.NEXTAUTH_URL}/welcome?purchaseId=${purchase.id}`,
          nextAuthOptions,
        })
      } else {
        console.error(`no email sent to ${user.email}`)
      }

      // Post to Slack to notify the team when a special-purpose coupon is
      // redeemed. Ignore redemption of bulk coupon.
      if (params.options.slack?.redeem && !bulkCouponRedemption) {
        await postRedemptionToSlack(
          user.email,
          purchase.productId,
          params.options.slack,
        )
      }

      return {
        status: 200,
        body: purchase,
      }
    } else {
      throw new CouponRedemptionError(
        `coupon-is-invalid-${couponId}`,
        couponId as string,
        email,
      )
    }
  } catch (error: any) {
    return {
      status: 500,
      body: {error: true, message: error.message},
    }
  }
}
