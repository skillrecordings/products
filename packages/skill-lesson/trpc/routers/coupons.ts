import {type Purchase, prisma} from '@skillrecordings/database'
import {adminProcedure, publicProcedure, router} from '../trpc.server'
import {getToken} from 'next-auth/jwt'
import {z} from 'zod'
import {format} from 'date-fns'

export const couponsRouter = router({
  claimedBy: publicProcedure
    .input(
      z.object({
        couponId: z.string().nullish(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (token && token.sub && input.couponId) {
        //verify ownership of coupon
        const coupon = await prisma.coupon.findFirst({
          where: {
            id: input.couponId,
            bulkCouponPurchases: {
              some: {
                userId: token.sub,
              },
            },
          },
          select: {
            bulkCouponRedemptionPurchases: {
              select: {
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
          },
        })
        return coupon?.bulkCouponRedemptionPurchases
      }

      return []
    }),
  get: publicProcedure.query(async ({ctx}) => {
    const coupons = await prisma.coupon.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return coupons
  }),
  delete: adminProcedure
    .input(z.object({ids: z.array(z.string())}))
    .mutation(async ({ctx, input}) => {
      const coupons = await prisma.coupon.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      })
      return coupons
    }),
  create: publicProcedure
    .input(
      z.object({
        quantity: z.string(),
        // coupon
        maxUses: z.string(),
        expires: z.date().optional(),
        restrictedToProductId: z.string().optional(),
        percentOff: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const quantityToGenerate = Number(input.quantity)
      const {percentOff, maxUses, expires, restrictedToProductId} = input
      const token = await getToken({req: ctx.req})
      const percentageDiscount = findClosestDiscount(Number(percentOff))

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
      const codesArray = []
      for (let i = 0; i < quantityToGenerate; i++) {
        const coupon = await prisma.coupon.create({
          data: {
            percentageDiscount,
            maxUses: Number(maxUses),
            restrictedToProductId: restrictedToProductId,
            merchantCouponId: merchantCoupon?.id,
            expires: expires
              ? new Date(expires?.setHours(23, 59, 0, 0)).toISOString()
              : null,
          },
        })
        codes += `${process.env.NEXT_PUBLIC_URL}?code=${coupon.id}\n`
        codesArray.push(`${process.env.NEXT_PUBLIC_URL}?code=${coupon.id}`)
      }

      return {codes: codesArray}
    }),
})

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
