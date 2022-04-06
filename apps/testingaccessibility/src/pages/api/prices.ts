import type {NextApiRequest, NextApiResponse} from 'next'
import {withSentry} from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'

import {formatPricesForProduct} from '../../utils/format-prices-for-product'
import {getSdk} from '../../lib/prisma-api'
import {setupHttpTracing} from '@skillrecordings/tracing'
import {tracer} from '../../utils/honeycomb-tracer'
import prisma from '../../db'
import {find, first} from 'lodash'
import {Purchase} from '@prisma/client'

const pricesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  setupHttpTracing({name: pricesHandler.name, tracer, req, res})
  if (req.method === 'POST') {
    try {
      const country = (req.headers['x-vercel-ip-country'] as string) || 'US'
      const {getDefaultCouponId} = getSdk()
      const {code, quantity, productId, coupon, purchases, userId} = req.body

      const availableUpgrades = purchases
        ? await prisma.upgradableProducts.findMany({
            where: {
              upgradableFromId: {
                in: purchases.map(({productId}: Purchase) => productId),
              },
              upgradableToId: productId,
            },
            select: {
              upgradableTo: {
                select: {
                  id: true,
                  name: true,
                },
              },
              upgradableFrom: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          })
        : []

      const upgradeFromPurchaseId = req.body.upgradeFromPurchaseId
        ? req.body.upgradeFromPurchaseId
        : purchases &&
          find(purchases, (purchase) => {
            const upgradeProductIds = availableUpgrades.map(
              (upgrade) => upgrade.upgradableFrom.id,
            )
            return upgradeProductIds.includes(purchase.productId)
          })?.id

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
        ...(upgradeFromPurchaseId && {upgradeFromPurchaseId}),
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
