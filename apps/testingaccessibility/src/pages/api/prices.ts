import type {NextApiRequest, NextApiResponse} from 'next'
import {withSentry} from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'

import {formatPricesForProduct} from '../../utils/format-prices-for-product'
import {getSdk} from '../../lib/prisma-api'

const pricesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const country = (req.headers['x-vercel-ip-country'] as string) || 'US'
      const {getDefaultCouponId} = getSdk()
      const {code, quantity, productId, coupon} = req.body

      const activeSaleCouponId = await getDefaultCouponId(productId)

      console.info(`request from ${country}`)

      const couponId = coupon ? coupon : activeSaleCouponId

      if (quantity > 100) throw new Error(`contact-for-pricing`)

      const product = await formatPricesForProduct({
        productId,
        country,
        quantity,
        code,
        couponId,
      })

      res.status(200).json(product)
    } catch (error: any) {
      Sentry.captureException(error)
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default withSentry(pricesHandler)

export const config = {
  api: {
    externalResolver: true,
  },
}
