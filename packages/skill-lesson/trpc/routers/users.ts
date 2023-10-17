import {getSdk, Purchase} from '@skillrecordings/database'
import {getToken} from 'next-auth/jwt'
import {publicProcedure, router} from '../trpc.server'

export const usersRouter = router({
  get: publicProcedure.query(async ({ctx}) => {
    const token = await getToken({req: ctx.req})
    const {getPurchasesForUser} = getSdk()
    if (!token) return null

    const users = await ctx.prisma.user.findMany({
      where: {
        id: {
          not: token.sub,
          //   role: {
          //     equals: 'User',
          //   },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        comments: true,
        lessonProgresses: true,
        roles: true,
        purchases: {
          include: {
            product: true,
            coupon: true,
            purchaseUserTransfers: true,
          },
        },
      },
    })
    const usersWithPurchases = await Promise.all(
      users.map(async (user: any) => {
        const purchases = await getPurchasesForUser(user.id)
        return {
          ...user,
          purchases,
        }
      }),
    )

    console.log({usersWithPurchases})
    return usersWithPurchases
  }),
})
