import {SanityDocument} from '@sanity/client'
import {Lesson} from '../lib/lesson'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'

export const getNextExercise = (
  module: SanityDocument,
  currentLesson: Lesson,
) => {
  if (currentLesson._type === 'lesson') {
    return currentLesson
  }

  const lessons = module.lessons

  const exerciseForSolution = lessons.find((resource: SanityDocument) => {
    return resource.solution?._key === currentLesson._key
  })
  const current = find(lessons, {_id: exerciseForSolution._id})
  const nextExerciseIndex = indexOf(lessons, current) + 1
  const nextExercise = lessons[nextExerciseIndex]
  return nextExercise
}
