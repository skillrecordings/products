import {getToken} from 'next-auth/jwt'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {getSdk} from '@skillrecordings/database'
import {isEmpty} from 'lodash'

export const userRouter = router({
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
})
