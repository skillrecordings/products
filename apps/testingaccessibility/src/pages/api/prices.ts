import type {NextApiRequest, NextApiResponse} from 'next'
import {withSentry} from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'

import {formatPricesForProduct} from '../../utils/format-prices-for-product'
import {getSdk} from '../../lib/prisma-api'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../../utils/honeycomb-tracer'
import {find} from 'lodash'
import {defaultContext} from '../../lib/context'
import {getActiveMerchantCoupon} from '../../utils/get-active-merchant-coupon'

const pricesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const spanContext = setupHttpTracing({
    name: pricesHandler.name,
    tracer,
    req,
    res,
  })
  if (req.method === 'POST') {
    try {
      const {availableUpgradesForProduct} = getSdk({
        ctx: defaultContext,
        spanContext,
      })

      const country = (req.headers['x-vercel-ip-country'] as string) || 'US'

      const {code, quantity, productId, coupon, purchases, siteCouponId} =
        req.body

      const availableUpgrades = await availableUpgradesForProduct(
        purchases,
        productId,
      )

      const upgradeFromPurchaseId = req.body.upgradeFromPurchaseId
        ? req.body.upgradeFromPurchaseId
        : purchases &&
          find(purchases, (purchase) => {
            const upgradeProductIds = availableUpgrades.map(
              (upgrade) => upgrade.upgradableFrom.id,
            )
            return upgradeProductIds.includes(purchase.productId)
          })?.id

      const {activeMerchantCoupon, defaultCoupon} =
        await getActiveMerchantCoupon({
          siteCouponId,
          code,
          productId,
          spanContext,
        })

      if (quantity > 100) throw new Error(`contact-for-pricing`)

      const product = await formatPricesForProduct(
        {
          productId,
          country,
          quantity,
          code,
          couponId: activeMerchantCoupon ? activeMerchantCoupon.id : coupon,
          ...(upgradeFromPurchaseId && {upgradeFromPurchaseId}),
        },
        spanContext,
      )

      res.status(200).json({...product, ...(defaultCoupon && {defaultCoupon})})
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
