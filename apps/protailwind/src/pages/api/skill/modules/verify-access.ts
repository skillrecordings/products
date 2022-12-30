import {NextApiRequest, NextApiResponse} from 'next'
import {getExercise} from 'lib/exercises'
import {z} from 'zod'
import {getToken} from 'next-auth/jwt'
import {getSubscriberFromCookie} from '@skillrecordings/skill-lesson/utils/ck-subscriber-from-cookie'
import {getWorkshop} from 'lib/workshops'
import {getTutorial} from 'lib/tutorials'
import {getSection} from 'lib/sections'
import {
  defineRulesForPurchases,
  UserSchema,
} from '@skillrecordings/skill-lesson/utils/ability'

const VerifyModuleAccessArgsSchema = z.object({
  moduleSlug: z.string().optional(),
  moduleType: z.string().optional(),
  lessonSlug: z.string().optional(),
  sectionSlug: z.string().optional(),
  isSolution: z.boolean().default(false).optional(),
})

const verifyModuleAccess = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'POST') {
    const {
      moduleSlug,
      moduleType,
      lessonSlug,
      sectionSlug,
      isSolution = false,
    } = VerifyModuleAccessArgsSchema.parse(req.body)
    const token = await getToken({req})
    const convertkitSubscriber = getSubscriberFromCookie(req)
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
    })

    res.status(200).json(rules)
  } else {
    res.status(404).end()
  }
}

export default verifyModuleAccess
