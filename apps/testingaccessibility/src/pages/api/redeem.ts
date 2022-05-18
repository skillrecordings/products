import type {NextApiRequest, NextApiResponse} from 'next'
import {validateCoupon} from '../../utils/validate-coupon'
import {sendServerEmail} from '../../utils/send-server-email'
import {nextAuthOptions} from './auth/[...nextauth]'
import prisma from '../../db'
import {withSentry} from '@sentry/nextjs'
import {getSdk} from '../../lib/prisma-api'
import * as Sentry from '@sentry/nextjs'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../../utils/honeycomb-tracer'

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

const redeemHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: redeemHandler.name, tracer, req, res})
  if (req.method === 'POST') {
    try {
      const {findOrCreateUser, getCoupon} = getSdk()

      const {email: baseEmail, couponId, sendEmail = true} = req.body

      if (!baseEmail) throw new Error('invalid-email')

      // something in the chain strips out the plus and leaves a space
      const email = String(baseEmail).replace(' ', '+')

      const coupon = await getCoupon({
        where: {id: couponId},
      })

      const couponValidation = validateCoupon(coupon)

      if (coupon && couponValidation.isValid) {
        const {user, isNewUser} = await findOrCreateUser(email)

        if (!user)
          throw new CouponRedemptionError(
            `unable-to-create-user`,
            couponId as string,
            email,
          )

        const existingPurchase = await prisma.purchase.findFirst({
          where: {
            userId: user.id,
            productId: coupon.restrictedToProductId as string,
            bulkCoupon: null,
          },
          select: {
            id: true,
          },
        })

        if (existingPurchase)
          throw new CouponRedemptionError(
            'already-purchased',
            couponId as string,
            email,
            existingPurchase.id,
          )

        const purchase = await prisma.purchase.create({
          data: {
            userId: user.id,
            couponId: coupon.id,
            productId: coupon.restrictedToProductId as string,
            totalAmount: 0,
          },
        })

        if (sendEmail)
          await sendServerEmail({
            email: user.email,
            callbackUrl: `${process.env.NEXTAUTH_URL}/welcome?purchaseId=${purchase.id}`,
            nextAuthOptions,
          })

        await prisma.coupon.update({
          where: {id: coupon.id},
          data: {
            usedCount: {
              increment: 1,
            },
          },
        })

        res.status(200).json(purchase)
        return
      } else {
        throw new CouponRedemptionError(
          `coupon-is-invalid`,
          couponId as string,
          email,
        )
      }
    } catch (error: any) {
      Sentry.captureException(error)
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default withSentry(redeemHandler)

export const config = {
  api: {
    externalResolver: true,
  },
}
