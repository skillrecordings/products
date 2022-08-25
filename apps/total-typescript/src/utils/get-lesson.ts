import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'
import flatMapDeep from 'lodash/flatMapDeep'
import indexOf from 'lodash/indexOf'

export const getNextLesson = (
  course: SanityDocument,
  currentLesson: SanityDocument,
) => {
  const lessons = flatMapDeep(course.resources, (section) =>
    section.resources ? section.resources : section,
  )
  const current = find(lessons, {slug: currentLesson.slug})
  const nextLessonIndex = indexOf(lessons, current) + 1
  const nextLesson = lessons[nextLessonIndex]
  return nextLesson
}
