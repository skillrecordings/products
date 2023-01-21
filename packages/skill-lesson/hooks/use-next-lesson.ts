import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'

import {type LessonResource} from '../schemas/lesson-resource'

import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {Module, Section} from './use-progress'

export const useNextLesson = (
  lesson: LessonResource,
  module: Module,
  section?: Section,
) => {
  const router = useRouter()

  let slug = lesson.slug

  if (lesson._type === 'solution') {
    slug = router.query.lesson as string
  }

  const {data: nextExercise} = trpcSkillLessons.lessons.getNextLesson.useQuery({
    type: lesson._type,
    slug,
    module: module.slug.current,
    section: section?.slug,
  })

  return nextExercise
}
