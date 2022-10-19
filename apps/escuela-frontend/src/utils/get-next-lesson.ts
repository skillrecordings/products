import {SanityDocument} from '@sanity/client'
import {Lesson} from 'lib/lessons'
import find from 'lodash/find'
import indexOf from 'lodash/indexOf'

export const getNextLesson = (
  module: SanityDocument,
  currentLesson: Lesson,
) => {
  if (currentLesson._type === 'lesson') {
    return currentLesson.solution
  }

  const lessonForSolution = module.lessons.find((resource: SanityDocument) => {
    return resource.solution?._key === currentLesson._key
  })

  const current = find(module.lessons, {_id: lessonForSolution._id})
  const nextLessonIndex = indexOf(module.lessons, current) + 1
  const nextLesson = module.lessons[nextLessonIndex]
  return nextLesson
}
