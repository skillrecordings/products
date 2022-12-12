import {createRouter} from 'server/createRouter'
import {getToken} from 'next-auth/jwt'
import {defineRulesForPurchases, UserSchema} from '../../ability/ability'

import {getSubscriberFromCookie} from '../ck-subscriber-from-cookie'
import {serialize} from 'cookie'
import {convertkitSetSubscriberCookie} from '../ck-set-subscriber-cookie'

export const abilities = createRouter().query('getAbilities', {
  async resolve({ctx, input}) {
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
  },
})
