import {z} from 'zod'
import {publicProcedure, router} from '../trpc.server'
import {getModule} from '../../lib/modules'
import {getSection} from '../../lib/sections'
import {getLesson} from '../../lib/lesson-resource'
import {getToken} from 'next-auth/jwt'
import {getSubscriberFromCookie} from '../../utils/ck-subscriber-from-cookie'
import {defineRulesForPurchases, UserSchema} from '../../utils/ability'
import {getProducts, getModuleProducts} from '../../lib/products'

export const modulesRouter = router({
  rules: publicProcedure
    .input(
      z.object({
        moduleSlug: z.string().nullish(),
        moduleType: z.string().optional(),
        lessonSlug: z.string().optional(),
        sectionSlug: z.string().optional(),
        isSolution: z.boolean().default(false).optional(),
        convertkitSubscriberId: z.number().optional(),
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

      const lesson = input.lessonSlug
        ? await getLesson(input.lessonSlug)
        : undefined
      const section = input.sectionSlug
        ? await getSection(input.sectionSlug)
        : undefined

      let purchasedModules = []

      if (token) {
        const user = UserSchema.parse(token)
        const productsPurchased =
          user.purchases?.map((purchase) => purchase.productId) || []
        const products = await getProducts(productsPurchased)
        const moduleProducts = await getModuleProducts(productsPurchased)
        purchasedModules.push(...products, ...moduleProducts)
      }

      return defineRulesForPurchases({
        ...(token && {user: UserSchema.parse(token)}),
        ...(convertkitSubscriber && {
          subscriber: convertkitSubscriber,
        }),
        country,
        module,
        lesson,
        section,
        purchasedModules,
        isSolution: input.isSolution,
      }) as any[]
    }),
})
