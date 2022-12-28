import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {getExercise} from 'lib/exercises'
import {z} from 'zod'
import {getToken} from 'next-auth/jwt'
import {getSubscriberFromCookie} from '../../../../server/ck-subscriber-from-cookie'
import {getWorkshop} from '../../../../lib/workshops'
import {getTutorial} from '../../../../lib/tutorials'
import {getSection} from '../../../../lib/sections'
import {defineRulesForPurchases, UserSchema} from '../../../../video/ability'
import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'

const VerifyModuleAccessArgsSchema = z.object({
  moduleSlug: z.string().optional(),
  moduleType: z.string().optional(),
  lessonSlug: z.string().optional(),
  sectionSlug: z.string().optional(),
  isSolution: z.boolean().default(false).optional(),
})

const nextLessonHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const input = JSON.parse(req.body)
    const lesson = await getExercise(input.slug)
    const section = input.section && (await getSection(input.section))
    const module = input.module && (await getTutorial(input.module))

    if (input.type === 'exercise') {
      res.status(200).json(lesson.solution)
    } else {
      const exercises = section ? section.exercises : module.exercises

      const exerciseForSolution = exercises.find((resource: SanityDocument) => {
        return resource.solution?._key === lesson.solution?._key
      })

      const current = find(exercises, {_id: exerciseForSolution._id})
      const nextExerciseIndex = indexOf(exercises, current) + 1

      res.status(200).json(exercises[nextExerciseIndex])
    }
  } else {
    res.status(404).end()
  }
}

export default withSentry(nextLessonHandler)
export const config = {
  api: {
    externalResolver: true,
  },
}
