import {z} from 'zod'
import {publicProcedure, router} from '../trpc.server'
import {getModule} from '../../lib/modules'
import {getSection} from '../../lib/sections'
import {getLesson} from '../../lib/lesson-resource'
import {getToken} from 'next-auth/jwt'
import {getSubscriberFromCookie} from '../../utils/ck-subscriber-from-cookie'
import {defineRulesForPurchases, UserSchema} from '../../utils/ability'

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
      const token = await getToken({req: ctx.req})
      const convertkitSubscriber = await getSubscriberFromCookie(ctx.req)
      const module = input.moduleSlug && (await getModule(input.moduleSlug))

      const lesson = input.lessonSlug
        ? await getLesson(input.lessonSlug)
        : undefined
      const section = input.sectionSlug
        ? await getSection(input.sectionSlug)
        : undefined

      return defineRulesForPurchases({
        ...(token && {user: UserSchema.parse(token)}),
        ...(convertkitSubscriber && {
          subscriber: convertkitSubscriber,
        }),
        module,
        lesson,
        section,
        isSolution: input.isSolution,
      }) as any[]
    }),
})
