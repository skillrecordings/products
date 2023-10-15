import {getToken} from 'next-auth/jwt'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {Redis} from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const unsubscribeRouter = router({
  unsubscribeFrom: publicProcedure
    .input(
      z.object({
        from: z.string(),
        userId: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (token || input.userId) {
        const UNSUBSCRIBED_KEY = `unsubscribed:${token?.id || input.userId}:${
          input.from
        }`
        await redis.set(UNSUBSCRIBED_KEY, true)
        return true
      } else {
        return false
      }
    }),
})
