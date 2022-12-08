import {createRouter} from 'server/createRouter'
import {z} from 'zod'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {
  Exercise,
  ExerciseMedia,
  ExerciseMediaSchema,
  ExerciseSchema,
  getExercise,
  getExerciseMedia,
} from '../../lib/exercises'
import {getToken} from 'next-auth/jwt'
import {getSubscriberFromCookie} from '../../utils/get-convertkit-subscriber-from-cookie'
import {getCurrentAbility, UserSchema} from '../../ability/ability'
import {getWorkshop} from '../../lib/workshops'
import {getTutorial} from '../../lib/tutorials'
import {getSection} from '../../lib/sections'

export const exerciseRouter = createRouter()
  .query('bySlug', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ctx, input}) {
      const exercise: Exercise = await sanityClient.fetch(
        groq`*[_type == "exercise" && slug.current == $slug][0]`,
        {slug: input.slug},
      )
      return ExerciseSchema.parse(exercise)
    },
  })
  .query('media', {
    input: z.object({
      moduleSlug: z.string().optional(),
      moduleType: z.string().optional(),
      lessonSlug: z.string().optional(),
      sectionSlug: z.string().optional(),
      isSolution: z.boolean().optional(),
      muxPlaybackId: z.nullable(z.string().optional()),
    }),
    async resolve({ctx, input}) {
      const token = await getToken({req: ctx.req})
      const convertkitSubscriber = getSubscriberFromCookie(ctx.req)
      const {
        moduleSlug,
        moduleType,
        lessonSlug,
        sectionSlug,
        isSolution = false,
        muxPlaybackId,
      } = input
      const module = moduleSlug
        ? moduleType === 'workshop'
          ? await getWorkshop(moduleSlug)
          : await getTutorial(moduleSlug)
        : undefined
      const lesson = lessonSlug ? await getExercise(lessonSlug) : undefined
      const section = sectionSlug ? await getSection(sectionSlug) : undefined

      const ability = getCurrentAbility({
        ...(token && {user: UserSchema.parse(token)}),
        ...(convertkitSubscriber && {
          subscriber: convertkitSubscriber,
        }),
        module,
        lesson,
        section,
        isSolution,
        muxPlaybackId,
      })

      if (lessonSlug && ability.can('view', 'Content')) {
        const exerciseMedia: ExerciseMedia = await getExerciseMedia(lessonSlug)
        return ExerciseMediaSchema.parse(exerciseMedia)
      }
    },
  })
