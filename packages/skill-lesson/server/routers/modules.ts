import {z} from 'zod'
import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'
import {publicProcedure, router} from '../trpc'
import {getModule} from '../../lib/modules'
import {getSection} from '../../lib/sections'
import {getLesson} from '../../lib/lesson-resource'
import {LessonResourceSchema} from '../../schemas/lesson-resource'
import {getToken} from 'next-auth/jwt'
import {getSubscriberFromCookie} from '../../utils/ck-subscriber-from-cookie'
import {defineRulesForPurchases, UserSchema} from '../../utils/ability'

export const modulesRouter = router({
  rules: publicProcedure
    .input(
      z.object({
        moduleSlug: z.string().optional(),
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

      console.log({token, slug: input.lessonSlug})

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
