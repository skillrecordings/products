import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getToken} from 'next-auth/jwt'
import {prisma} from '@skillrecordings/database'
import {isAfter} from 'date-fns'

export const deviceVerificationRouter = router({
  verify: publicProcedure
    .input(
      z.object({
        userCode: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})

      if (token) {
        const deviceVerification = await prisma.deviceVerification.findFirst({
          where: {
            userCode: input.userCode,
          },
        })

        if (deviceVerification) {
          if (deviceVerification.verifiedAt) {
            return {status: 'already-verified'}
          }

          if (isAfter(new Date(), deviceVerification.expires)) {
            return {status: 'code-expired'}
          }

          await prisma.deviceVerification.update({
            where: {
              deviceCode: deviceVerification.deviceCode,
            },
            data: {
              verifiedAt: new Date(),
              verifiedByUserId: token.id as string,
            },
          })

          return {status: 'device-verified'}
        } else {
          return {status: 'no-verification-found'}
        }
      } else {
        return {status: 'login-required'}
      }
    }),
})
