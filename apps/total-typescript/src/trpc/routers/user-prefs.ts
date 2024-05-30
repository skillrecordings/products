import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {
  getLocalUserPrefs,
  localPrefsFieldsSchema,
  setLocalUserPrefs,
} from '@/lib/user-prefs'
import {getToken} from 'next-auth/jwt'
import {z} from 'zod'

export const userPrefsRouter = router({
  setLocal: publicProcedure
    .input(
      z.object({
        resourceId: z.string(),
        fields: localPrefsFieldsSchema,
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token) {
        throw new Error('Unauthorized')
      }

      return await setLocalUserPrefs({
        resourceId: input.resourceId,
        userId: token.id as string,
        fields: input.fields,
      })
    }),
  getLocal: publicProcedure
    .input(
      z.object({
        resourceId: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      if (!token) {
        throw new Error('Unauthorized')
      }

      return await getLocalUserPrefs({
        resourceId: input.resourceId,
        userId: token.id as string,
      })
    }),
})
