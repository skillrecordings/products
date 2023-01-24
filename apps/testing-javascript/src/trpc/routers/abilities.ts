import {getToken} from 'next-auth/jwt'
import {
  defineRulesForPurchases,
  UserSchema,
} from '@skillrecordings/skill-lesson/utils/ability'

import {getSubscriberFromCookie} from '@skillrecordings/skill-lesson/utils/ck-subscriber-from-cookie'
import {convertkitSetSubscriberCookie} from '@skillrecordings/skill-lesson/utils/ck-set-subscriber-cookie'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'

export const abilities = router({
  getAbilities: publicProcedure.query(async ({ctx, input}) => {
    const token = await getToken({req: ctx.req})
    const convertkitSubscriber = await getSubscriberFromCookie(ctx.req)

    // TODO: where could we move this? It doesn't seem like an ability check is
    // the best place to set a cookie.
    convertkitSetSubscriberCookie({
      subscriber: convertkitSubscriber,
      res: ctx.res,
    })

    return defineRulesForPurchases({
      ...(token && {user: UserSchema.parse(token)}),
      ...(convertkitSubscriber && {
        subscriber: convertkitSubscriber,
      }),
    }) as any
  }),
})
