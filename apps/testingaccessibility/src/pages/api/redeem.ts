import type {NextApiRequest, NextApiResponse} from 'next'
import {validateCoupon} from '../../utils/validate-coupon'
import {sendServerEmail} from '../../utils/send-server-email'
import {nextAuthOptions} from './auth/[...nextauth]'
import prisma from '../../db'
import {withSentry} from '@sentry/nextjs'

const redeemHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const country = (req.headers['x-vercel-ip-country'] as string) || 'US'
      const {email: baseEmail, couponId} = req.query

      if (!baseEmail) throw new Error('invalid-email')

      const email = String(baseEmail).replace(' ', '+')

      const coupon = await prisma.coupon.findFirst({
        where: {id: couponId as string},
      })

      const validation = validateCoupon(coupon)

      if (coupon && validation.isValid) {
        let user = await prisma.user.findFirst({
          where: {
            email,
          },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {email: email as string},
          })
        }

        if (!user) throw new Error(`unable-to-create-user`)

        const existingPurchase = await prisma.purchase.findFirst({
          where: {
            userId: user.id,
          },
        })

        if (existingPurchase) throw new Error('already-purchased')

        const purchase = await prisma.purchase.create({
          data: {
            userId: user.id,
            couponId: coupon.id,
            productId: coupon.restrictedToProductId,
          },
        })

        await sendServerEmail({
          email: user.email,
          nextAuthOptions,
        })

        await prisma.coupon.update({
          where: {id: coupon.id},
          data: {
            usedCount: coupon.usedCount + 1,
          },
        })

        res.redirect(303, `/thanks/redeem?purchaseId=${purchase?.id}`)
        return
      } else {
        throw new Error(`coupon-is-invalid`)
      }
    } catch (error: any) {
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default withSentry(redeemHandler)
