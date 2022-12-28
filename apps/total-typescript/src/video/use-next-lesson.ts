import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'

import {type LessonResource} from './lesson-resources'

import {useQuery} from '@tanstack/react-query'

export const useNextLesson = (
  lesson: LessonResource,
  module: SanityDocument,
  section?: SanityDocument,
) => {
  const router = useRouter()
  const {data: nextExercise} = useQuery(
    ['next-lesson', lesson.slug],
    async () => {
      return await fetch('/api/skill/lessons/next', {
        method: 'POST',
        body: JSON.stringify({
          type: lesson._type,
          slug: router.query.exercise as string,
          module: module.slug.current,
          section: section?.slug,
        }),
      }).then((r) => r.json())
    },
  )
  return nextExercise
}
