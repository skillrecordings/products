import type {NextApiRequest, NextApiResponse} from 'next'

import * as Sentry from '@sentry/nextjs'
import {getToken} from 'next-auth/jwt'
import {getSdk, prisma} from '@skillrecordings/database'
const ROLES_WITH_ACCESS = ['ADMIN', 'SUPERADMIN']

/**
 * @link https://www.gavsblog.com/blog/find-closest-number-in-array-javascript
 * @param percentOff
 */
const findClosestDiscount = function (percentOff: number) {
  // we want a fraction so if it is whole number, we make it fractional
  percentOff = percentOff <= 1 ? percentOff : percentOff / 100
  return [1, 0.95, 0.9, 0.75, 0.6, 0.5, 0.4, 0.25, 0.1].reduce((a, b) => {
    let aDiff = Math.abs(a - percentOff)
    let bDiff = Math.abs(b - percentOff)

    if (aDiff === bDiff) {
      // Choose largest vs smallest (> vs <)
      return a > b ? a : b
    } else {
      return bDiff < aDiff ? b : a
    }
  })
}

const adminCouponGenerator = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const token = await getToken({req})

  if (!ROLES_WITH_ACCESS.includes(token?.role as string)) {
    res.status(404).end()
    return
  }

  if (req.method === 'GET') {
    try {
      const {
        quantity = '1',
        percentOff = '100',
        productId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID,
        maxUses = '1',
      } = req.query

      const {getProduct} = getSdk()

      const quantityToGenerate = Number(quantity)
      const percentageDiscount = findClosestDiscount(Number(percentOff))

      const product = await getProduct({
        where: {
          id: productId as string,
        },
      })

      if (!product) {
        throw new Error(`invalid product id: ${productId}`)
      }

      const merchantCoupon =
        percentageDiscount < 1
          ? await prisma.merchantCoupon.findFirst({
              where: {
                percentageDiscount,
                type: 'special',
              },
            })
          : null

      let codes = ``

      for (let i = 0; i < quantityToGenerate; i++) {
        const coupon = await prisma.coupon.create({
          data: {
            percentageDiscount,
            maxUses: Number(maxUses),
            restrictedToProductId: product.id,
            merchantCouponId: merchantCoupon?.id,
          },
        })
        codes += `${process.env.NEXT_PUBLIC_URL}?code=${coupon.id}\n`
      }

      res.status(200).send(codes)
    } catch (error: any) {
      Sentry.captureException(error)
      res.status(500).json({error: true, message: error.message})
    }
  } else {
    console.error('non-GET request made')
    res.status(404).end()
  }
}

export default adminCouponGenerator
