import {useRouter} from 'next/router'

import {type Lesson} from '../schemas/lesson'

import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {type Section} from '../schemas/section'
import {type Module} from '../schemas/module'

export const useNextLesson = (
  lesson: Lesson,
  module: Module,
  section?: Section,
) => {
  const router = useRouter()

  let slug = lesson.slug

  if (lesson._type === 'solution') {
    slug = router.query.lesson as string
  }

  const {data: nextExercise, status: nextExerciseStatus} =
    trpcSkillLessons.lessons.getNextLesson.useQuery({
      type: lesson._type,
      slug,
      module: module.slug.current,
      section: section?.slug,
    })

  return {nextExercise, nextExerciseStatus}
}
