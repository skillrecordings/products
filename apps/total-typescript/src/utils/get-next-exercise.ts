import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'

export const getNextExercise = (
  course: SanityDocument,
  currentExercise: SanityDocument,
) => {
  if (currentExercise._type === 'exercise') {
    return currentExercise.resources.find(
      (resource: SanityDocument) => resource._type === 'solution',
    )
  }

  const exerciseForSolution = course.exercises.find(
    (resource: SanityDocument) => {
      const solution = resource.resources.find(
        (resource: SanityDocument) => resource._key === currentExercise._key,
      )
      return solution?._key === currentExercise._key
    },
  )

  const current = find(course.exercises, {_id: exerciseForSolution._id})
  const nextExerciseIndex = indexOf(course.exercises, current) + 1
  const nextExercise = course.exercises[nextExerciseIndex]
  return nextExercise
}
