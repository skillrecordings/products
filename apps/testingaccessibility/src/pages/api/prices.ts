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

function couponIsValid(coupon?: Coupon | null) {
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
      const {getDefaultCoupon, availableUpgradesForProduct, couponForIdOrCode} =
        getSdk({
          ctx: defaultContext,
          spanContext,
        })
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

      let couponId = null

      const activeDefaultSiteSaleCoupon = await getDefaultCoupon(productId)

      const incomingCoupon = await couponForIdOrCode({
        couponId: siteCouponId,
        code,
      })

      if (
        // compare the discounts if there is a coupon and site/sale running
        incomingCoupon?.merchantCoupon &&
        couponIsValid(incomingCoupon) &&
        activeDefaultSiteSaleCoupon
      ) {
        const {merchantCoupon} = incomingCoupon
        if (
          merchantCoupon.percentageDiscount >
          activeDefaultSiteSaleCoupon.percentageDiscount
        ) {
          couponId = merchantCoupon.id
        } else {
          couponId = activeDefaultSiteSaleCoupon.id
        }
      } else if (
        // if it's a coupon, use it
        incomingCoupon?.merchantCoupon &&
        couponIsValid(incomingCoupon)
      ) {
        couponId = incomingCoupon.merchantCoupon.id
      } else if (
        // if a sale is running, use that
        activeDefaultSiteSaleCoupon
      ) {
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
