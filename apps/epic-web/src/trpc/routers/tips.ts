import {
  getCurrentAbility,
  publicProcedure,
  router,
  UserSchema,
} from '@skillrecordings/skill-lesson'
import {z} from 'zod'
import {getAllTips, getTip, TipSchema} from '../../lib/tips'
import {sanityWriteClient} from '@skillrecordings/skill-lesson/utils/sanity-server'
import {groupBy} from 'lodash'
import {getToken} from 'next-auth/jwt'
import {v4} from 'uuid'
import {inngest} from 'utils/inngest.server'

export const tipsRouter = router({
  update: publicProcedure
    .input(
      z.object({
        slug: z.string(),
        body: z.string().optional().nullable(),
        title: z.string().optional(),
        _id: z.string(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      const token = await getToken({req: ctx.req})
      const ability = getCurrentAbility({
        user: UserSchema.parse(token),
      })

      if (ability.can('create', 'Content')) {
        const tip = await sanityWriteClient
          .patch(input._id)
          .set({
            title: input.title,
            body: input.body,
            slug: {
              current: input.slug,
            },
          })
          .commit()
        return await getTip(tip.slug.current)
      }

      throw new Error('Unauthorized')
    }),
  create: publicProcedure
    .input(
      z.object({
        s3Url: z.string(),
        fileName: z.string().nullable(),
      }),
    )
    .mutation(async ({ctx, input}) => {
      // create a video resource, which should trigger the process of uploading to
      // mux and ordering a transcript because of the active webhook
      const token = await getToken({req: ctx.req})
      const ability = getCurrentAbility({
        user: UserSchema.parse(token),
      })

      if (ability.can('create', 'Content')) {
        const newVideoResource = await sanityWriteClient.create({
          _id: `videoResource-${v4()}`,
          _type: 'videoResource',
          state: 'new',
          title: input.fileName,
          originalMediaUrl: input.s3Url,
        })

        if (newVideoResource._id) {
          const id = v4()

          const tipResource = await sanityWriteClient.create({
            _id: `tip-${id}`,
            _type: 'tip',
            state: 'new',
            title: 'New Tip',
            slug: {
              current: id,
            },
            resources: [
              {
                _key: v4(),
                _type: 'reference',
                _ref: newVideoResource._id,
              },
            ],
          })

          const tip = await getTip(tipResource.slug.current)

          inngest.send({
            name: 'tip/video.uploaded',
            data: {
              tipId: tip._id,
              videoResourceId: newVideoResource._id,
            },
          })

          return tip
        } else {
          throw new Error('Could not create video resource')
        }
      } else {
        throw new Error('Unauthorized')
      }
    }),
  all: publicProcedure
    .input(
      z
        .object({
          grouped: z.boolean().optional(),
        })
        .optional(),
    )
    .query(async ({input}) => {
      const tips = await getAllTips(false)

      const tipGroups = groupBy(tips, 'state')
      const tipGroupsArray = Object.entries(tipGroups).map(([key, value]) => {
        return {state: key, tips: value.map((t) => TipSchema.parse(t))}
      })
      return tipGroupsArray.reverse()
    }),
  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ctx, input}) => {
      const lesson = await getTip(input.slug)

      return lesson
    }),
})
