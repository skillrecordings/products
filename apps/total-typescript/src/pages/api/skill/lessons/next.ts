import {NextApiRequest, NextApiResponse} from 'next'
import {getExercise} from 'lib/exercises'

import {getTutorial} from 'lib/tutorials'
import {getSection} from 'lib/sections'
import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'

const nextLessonHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const input = req.body
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

export default nextLessonHandler
