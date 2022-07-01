import type {NextApiRequest, NextApiResponse} from 'next'
import {withSentry} from '@sentry/nextjs'
import * as Sentry from '@sentry/nextjs'

import {formatPricesForProduct} from '../../utils/format-prices-for-product'
import {getSdk} from '../../lib/prisma-api'
import {setupHttpTracing} from '@vercel/tracing-js'
import {tracer} from '../../utils/honeycomb-tracer'
import prisma from '../../db'
import {find} from 'lodash'
import {Coupon, Purchase} from '@prisma/client'
import {defaultContext} from '../../lib/context'

function couponIsValid(coupon?: Coupon) {
  if (!coupon) return false
  if (coupon.usedCount >= coupon.maxUses) return false
  if (coupon.expires && coupon.expires < new Date()) return false
  return true
}

const pricesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const spanContext = setupHttpTracing({
    name: pricesHandler.name,
    tracer,
    req,
    res,
  })
  if (req.method === 'POST') {
    try {
      const country = (req.headers['x-vercel-ip-country'] as string) || 'US'
      const {getDefaultCoupon} = getSdk({ctx: defaultContext, spanContext})
      const {code, quantity, productId, coupon, purchases, siteCouponId} =
        req.body

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

      let couponId = null

      const activeDefaultSiteSaleCoupon = await getDefaultCoupon(productId)

      const incomingCoupon =
        (siteCouponId || code) &&
        (await prisma.coupon.findFirst({
          where: {
            OR: [
              {
                OR: [{id: siteCouponId}, {code}],
                expires: {
                  gte: new Date(),
                },
              },
              {OR: [{id: siteCouponId}, {code}], expires: null},
            ],
          },
          select: {
            usedCount: true,
            maxUses: true,
            expires: true,
            merchantCoupon: {
              select: {
                id: true,
                percentageDiscount: true,
              },
            },
          },
        }))

      console.log(incomingCoupon, code)

      if (couponIsValid(incomingCoupon) && activeDefaultSiteSaleCoupon) {
        const {merchantCoupon} = incomingCoupon
        if (
          merchantCoupon.percentageDiscount >
          activeDefaultSiteSaleCoupon.percentageDiscount
        ) {
          couponId = merchantCoupon.id
        } else {
          couponId = activeDefaultSiteSaleCoupon.id
        }
      } else if (couponIsValid(incomingCoupon)) {
        couponId = incomingCoupon.merchantCoupon.id
      } else if (activeDefaultSiteSaleCoupon) {
        couponId = activeDefaultSiteSaleCoupon.id
      }

      console.info(`request from ${country}`)

      couponId = coupon ? coupon : couponId

      if (quantity > 100) throw new Error(`contact-for-pricing`)

      const product = await formatPricesForProduct(
        {
          productId,
          country,
          quantity,
          code,
          couponId,
          ...(upgradeFromPurchaseId && {upgradeFromPurchaseId}),
        },
        spanContext,
      )

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
