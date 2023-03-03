import {getToken} from 'next-auth/jwt'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {getSdk} from '@skillrecordings/database'
import {isEmpty} from 'lodash'

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
})
