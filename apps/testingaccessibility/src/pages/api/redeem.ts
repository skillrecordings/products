import type {NextApiRequest, NextApiResponse} from 'next'
import {getAdminSDK} from '../../lib/api'
import {validateCoupon} from '../../utils/validate-coupon'
import {isEmpty} from 'lodash'
import {sendServerEmail} from '../../utils/send-server-email'
import {nextAuthOptions} from './auth/[...nextauth]'

const redeemHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const {getCoupon, updateCoupon, QueryUser, CreateUser, createPurchase} =
      getAdminSDK()
    try {
      const country = (req.headers['x-vercel-ip-country'] as string) || 'US'
      const {email: baseEmail, couponId} = req.query

      if (!baseEmail) throw new Error('invalid-email')

      const email = String(baseEmail).replace(' ', '+')

      const {coupons_by_pk: coupon} = await getCoupon({id: couponId})

      const validation = validateCoupon(coupon)

      if (coupon && validation.isValid) {
        const {users} = await QueryUser({
          where: {
            email: {
              _eq: email as string,
            },
          },
        })

        let user

        if (isEmpty(users)) {
          const {insert_users_one} = await CreateUser({
            data: {email: email as string},
          })

          user = insert_users_one

          const {insert_purchases_one: purchase} = await createPurchase({
            data: {
              user_id: user?.id,
              coupon_id: coupon.id,
              product_id: coupon.restricted_to_product_id,
            },
          })

          res.redirect(303, `/thanks/redeem?purchaseId=${purchase?.id}`)

          await sendServerEmail({
            email: user?.email as string,
            nextAuthOptions,
          })

          await updateCoupon({
            id: coupon.id,
            data: {used_count: coupon.used_count + 1},
          })
        } else {
          // TODO: Handle user already existing with purchases etc
        }
      } else {
        // TODO: Send to an error page because the coupon isn't valid
        // likely a toast on the /buy page so they can purchase as needed
        // but we can also inform the original purchaser if it is a used
        // up code or whatever
      }
    } catch (error: any) {
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default redeemHandler
