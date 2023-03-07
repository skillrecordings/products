import {z} from 'zod'
import {publicProcedure, router} from '../trpc.server'
import {getVideoResource} from '../../lib/video-resources'
import {getToken} from 'next-auth/jwt'
import {getCurrentAbility, UserSchema} from '../../utils/ability'
import {getSubscriberFromCookie} from '../../utils/ck-subscriber-from-cookie'
import {getModule} from '../../lib/modules'
import {getModuleProducts, getProducts} from '../../lib/products'

export const videoResourceRouter = router({
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
        moduleSlug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const country =
        (ctx.req.headers['x-vercel-ip-country'] as string) ||
        process.env.DEFAULT_COUNTRY ||
        'US'
      const token = await getToken({req: ctx.req})
      const convertkitSubscriber = await getSubscriberFromCookie(ctx.req)
      const module = input.moduleSlug && (await getModule(input.moduleSlug))

      let purchasedModules = []

      if (token) {
        const user = UserSchema.parse(token)
        const productsPurchased =
          user.purchases?.map((purchase) => purchase.productId) || []
        const products = await getProducts(productsPurchased)
        const moduleProducts = await getModuleProducts(productsPurchased)
        purchasedModules.push(...products, ...moduleProducts)
      }

      const ability = getCurrentAbility({
        ...(token && {user: UserSchema.parse(token)}),
        ...(convertkitSubscriber && {
          subscriber: convertkitSubscriber,
        }),
        country,
        module,
        purchasedModules,
      })

      console.log(ability.can('view', 'Content'))
      return await getVideoResource(input.id)
    }),
})
