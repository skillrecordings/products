import {getToken} from 'next-auth/jwt'
import {
  defineRulesForPurchases,
  UserSchema,
} from '@skillrecordings/skill-lesson/utils/ability'

import {getSubscriberFromCookie} from '@skillrecordings/skill-lesson/utils/ck-subscriber-from-cookie'
import {convertkitSetSubscriberCookie} from '@skillrecordings/skill-lesson/utils/ck-set-subscriber-cookie'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {getProducts} from '@skillrecordings/skill-lesson/lib/products'

export const abilitiesRouter = router({
  getAbilities: publicProcedure.query(async ({ctx, input}) => {
    const country =
      (ctx.req.headers['x-vercel-ip-country'] as string) ||
      process.env.DEFAULT_COUNTRY ||
      'US'
    const token = await getToken({req: ctx.req})
    const convertkitSubscriber = await getSubscriberFromCookie(ctx.req)

    convertkitSetSubscriberCookie({
      subscriber: convertkitSubscriber,
      res: ctx.res,
    })

    let purchasedModules = []

    if (token) {
      const user = UserSchema.parse(token)
      const productsPurchased =
        user.purchases?.map((purchase) => purchase.productId) || []
      purchasedModules = await getProducts(productsPurchased)
    }

    return defineRulesForPurchases({
      ...(token && {user: UserSchema.parse(token)}),
      ...(convertkitSubscriber && {
        subscriber: convertkitSubscriber,
      }),
      purchasedModules,
      country,
    }) as any
  }),
})
