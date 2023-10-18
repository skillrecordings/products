import {getSdk, Purchase} from '@skillrecordings/database'
import {getToken} from 'next-auth/jwt'
import {publicProcedure, router} from '../trpc.server'
import {z} from 'zod'

export const usersRouter = router({
  get: publicProcedure
    .input(
      z
        .object({
          take: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token) return null

      const users = await ctx.prisma.user.findMany({
        // take, // TODO: pagination
        where: {
          id: {
            not: token.sub,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          lessonProgresses: true,
          purchases: {
            include: {
              product: true,
              coupon: true,
              purchaseUserTransfers: true,
              merchantCharge: true,
            },
          },
        },
      })

      return users
    }),
})
