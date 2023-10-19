import {getToken} from 'next-auth/jwt'
import {publicProcedure, router} from '../trpc.server'
import {isEmpty} from 'lodash'
import {z} from 'zod'

export const userRouter = router({
  currentUser: publicProcedure.query(async ({ctx, input}) => {
    const token = await getToken({req: ctx.req})
    if (!token) return null

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: token.id as string,
      },
      include: {
        accounts: true,
      },
    })
    return user
  }),
  githubConnected: publicProcedure.query(async ({ctx, input}) => {
    const token = await getToken({req: ctx.req})
    if (!token) return false

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: token.id as string,
      },
      include: {
        accounts: {
          where: {
            provider: 'github',
          },
        },
      },
    })
    return !isEmpty(user?.accounts)
  }),
  disconnectGithub: publicProcedure.mutation(async ({ctx, input}) => {
    const token = await getToken({req: ctx.req})
    if (!token) return false

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: token.id as string,
      },
      include: {
        accounts: {
          where: {
            provider: 'github',
          },
        },
      },
    })

    if (isEmpty(user?.accounts) || user === null) return false

    await ctx.prisma.account.delete({
      where: {
        id: user.accounts[0].id,
      },
    })

    return true
  }),
  updateName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token) throw new Error('Unauthorized')
      if (!input.name) throw new Error('Name is required')

      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: token.id as string,
        },
        data: {
          name: input.name,
        },
      })

      return updatedUser
    }),
})
