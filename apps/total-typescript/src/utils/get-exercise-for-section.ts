import {SanityDocument} from '@sanity/client'
import find from 'lodash/find'

export function getExerciseForSection(section: SanityDocument) {
  return (
    find(section.resources, (lesson: SanityDocument) => {
      return lesson.lessonType === 'exercise'
    }) || section
  )
}
