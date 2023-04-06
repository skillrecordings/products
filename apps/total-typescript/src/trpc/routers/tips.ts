import {getToken} from 'next-auth/jwt'
import {getCurrentAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {publicProcedure, router} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {sanityWriteClient} from '../../utils/sanity-server'

export const tipsRouter = router({
  createTip: publicProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      const ability = getCurrentAbility({user: token as any})

      console.log({ability, token})

      if (ability.can('create', 'Content')) {
        return await sanityWriteClient.create({
          _type: 'tip',
          title: input.title,
          slug: {
            current: input.title
              .toLowerCase()
              .replace(/\s+/g, '-') // Replace spaces with -
              .replace(/[^\w\-]+/g, '') // Remove all non-word chars
              .replace(/\-\-+/g, '-') // Replace multiple - with single -
              .replace(/^-+/, '') // Trim - from start of text
              .replace(/-+$/, ''),
          },
          state: 'draft',
        })
      } else {
        throw new Error('Not authorized')
      }
    }),
})
