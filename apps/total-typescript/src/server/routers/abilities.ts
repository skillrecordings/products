import {getToken} from 'next-auth/jwt'
import {defineRulesForPurchases, UserSchema} from '../../video/ability'

import {getSubscriberFromCookie} from '../ck-subscriber-from-cookie'
import {convertkitSetSubscriberCookie} from '../ck-set-subscriber-cookie'
import {publicProcedure, router} from '../trpc'

export const abilities = router({
  getAbilities: publicProcedure.query(async ({ctx, input}) => {
    const token = await getToken({req: ctx.req})
    const convertkitSubscriber = await getSubscriberFromCookie(ctx.req)

    convertkitSetSubscriberCookie({
      subscriber: convertkitSubscriber,
      res: ctx.res,
    })

    return defineRulesForPurchases({
      ...(token && {user: UserSchema.parse(token)}),
      ...(convertkitSubscriber && {
        subscriber: convertkitSubscriber,
      }),
    })
  }),
})
