import type {NextApiRequest, NextApiResponse} from 'next'

import {formatPricesForProduct} from '../../utils/format-prices-for-product'

const pricesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const country = (req.headers['x-vercel-ip-country'] as string) || 'US'

      console.info(`request from ${country}`)

      const {code, quantity, productId, coupon: couponId} = req.body

      const product = await formatPricesForProduct({
        productId,
        country,
        quantity,
        code,
        couponId,
      })

      res.status(200).json(product)
    } catch (error: any) {
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-POST request made')
    res.status(404).end()
  }
}

export default pricesHandler
