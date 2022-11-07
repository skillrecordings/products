import {SanityDocument} from '@sanity/client'
import {Exercise} from 'lib/exercises'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'

export const getNextExercise = ({
  module,
  currentLesson,
  section,
}: {
  module: SanityDocument

  currentLesson: Exercise
  section?: SanityDocument
}) => {
  if (currentLesson._type === 'exercise') {
    return currentLesson.solution
  }

  const exercises = section ? section.exercises : module.exercises

  const exerciseForSolution = exercises.find((resource: SanityDocument) => {
    return resource.solution?._key === currentLesson._key
  })

  const current = find(exercises, {_id: exerciseForSolution._id})
  const nextExerciseIndex = indexOf(exercises, current) + 1
  const nextExercise = exercises[nextExerciseIndex]
  return nextExercise
}
