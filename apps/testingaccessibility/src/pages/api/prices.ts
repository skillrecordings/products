import type {NextApiRequest, NextApiResponse} from 'next'

import {formatPricesForProduct} from '../../utils/format-prices-for-product'
import {getSdk} from '../../lib/prisma-api'
import {getActiveCouponId} from '../../utils/get-active-coupon-id'

const pricesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const {availableUpgradesForProduct} = getSdk()

      const country = (req.headers['x-vercel-ip-country'] as string) || 'US'

      const {code, quantity, productId, coupon, purchases, siteCouponId} =
        req.body

      const availableUpgrades = await availableUpgradesForProduct(
        purchases,
        productId,
      )

      const upgradeFromPurchaseId = req.body.upgradeFromPurchaseId
        ? req.body.upgradeFromPurchaseId
        : purchases?.find((purchase: any) => {
            const upgradeProductIds = availableUpgrades.map(
              (upgrade) => upgrade.upgradableFrom.id,
            )
            return upgradeProductIds.includes(purchase.productId)
          })?.id

      const couponId = await getActiveCouponId({
        siteCouponId,
        coupon,
        code,
        productId,
      })

      if (quantity > 100) throw new Error(`contact-for-pricing`)

      const product = await formatPricesForProduct({
        productId,
        country,
        quantity,
        code,
        couponId,
        ...(upgradeFromPurchaseId && {upgradeFromPurchaseId}),
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
