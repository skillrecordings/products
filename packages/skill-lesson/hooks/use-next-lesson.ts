import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'

import {type LessonResource} from '../schemas/lesson-resource'

import {trpcSkillLessons} from '../utils/trpc-skill-lessons'

export const useNextLesson = (
  lesson: LessonResource,
  module: SanityDocument,
  section?: SanityDocument,
) => {
  const {data: nextExercise} = trpcSkillLessons.lessons.getNextLesson.useQuery({
    type: lesson._type,
    slug: lesson.slug,
    module: module.slug.current,
    section: section?.slug,
  })

  return nextExercise
}
