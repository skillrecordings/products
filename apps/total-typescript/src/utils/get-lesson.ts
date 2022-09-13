import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'

export const getNextLesson = (
  course: SanityDocument,
  currentLesson: SanityDocument,
) => {
  if (currentLesson._type === 'exercise') {
    return currentLesson.resources.find(
      (resource: SanityDocument) => resource._type === 'solution',
    )
  }

  const exerciseForSolution = course.exercises.find(
    (resource: SanityDocument) => {
      const solution = resource.resources.find(
        (resource: SanityDocument) => resource._key === currentLesson._key,
      )
      return solution?._key === currentLesson._key
    },
  )

  const current = find(course.exercises, {_id: exerciseForSolution._id})
  const nextLessonIndex = indexOf(course.exercises, current) + 1
  const nextLesson = course.exercises[nextLessonIndex]
  return nextLesson
}
