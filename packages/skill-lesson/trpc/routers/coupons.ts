import {getSdk, Purchase, prisma} from '@skillrecordings/database'
import {publicProcedure, router} from '../trpc.server'
import {get, isEmpty, last} from 'lodash'
import {getToken} from 'next-auth/jwt'
import {z} from 'zod'

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
})
