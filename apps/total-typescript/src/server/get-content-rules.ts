import {z} from 'zod'
import {NextApiRequest} from 'next'
import {getToken} from 'next-auth/jwt'
import {getSubscriberFromCookie} from '../utils/get-convertkit-subscriber-from-cookie'
import {getWorkshop} from '../lib/workshops'
import {getTutorial} from '../lib/tutorials'
import {getExercise} from '../lib/exercises'
import {getSection} from '../lib/sections'
import {defineRulesForPurchases, UserSchema} from '../ability/ability'

export const ContentRulesSchema = z.object({
  moduleSlug: z.string().optional(),
  moduleType: z.string().optional(),
  lessonSlug: z.string().optional(),
  sectionSlug: z.string().optional(),
  isSolution: z.boolean().optional(),
  muxPlaybackId: z.nullable(z.string().optional()),
})

export type ContentRules = z.infer<typeof ContentRulesSchema>

export async function getContentRules(
  req: NextApiRequest,
  input: ContentRules,
) {
  const token = await getToken({req})
  const convertkitSubscriber = getSubscriberFromCookie(req)
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

  const rules = defineRulesForPurchases({
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

  return rules
}
