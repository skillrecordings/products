import React from 'react'
import {SanityDocument} from '@sanity/client'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {first, filter, find, flatMap, get, indexOf, isEmpty, map} from 'lodash'
import {getNextSection} from '../utils/get-next-section'

export const useModuleProgress = ({module}: {module: SanityDocument}) => {
  const {sections} = module
  const {data: userProgress, status: userProgressStatus} =
    trpcSkillLessons.progress.get.useQuery()

  const exercises = flatMap(sections, (s) => s.lessons)
  const resources = flatMap(sections, (s) =>
    map(s.lessons, (l) => (l.solution ? l.solution : l)),
  )

  // storing this in state allows to refetch nextExercise
  // in case the original next is already completed
  const [lastCompletedExercise, setLastCompletedExercise] = React.useState(
    first(exercises),
  )

  const moduleProgress = filter(userProgress, ({lessonSlug, completedAt}) => {
    if (!completedAt) return
    return find(resources, {slug: lessonSlug})
  })

  let lastCompletedSolution = first(resources)

  React.useEffect(() => {
    if (userProgressStatus === 'success' && lastCompletedSolution) {
      setLastCompletedExercise(
        find(exercises, {
          slug: lastCompletedSolution.slug,
        }) ||
          find(exercises, {
            solution: lastCompletedSolution,
          }),
      )
    }
  }, [userProgressStatus])

  if (!isEmpty(moduleProgress)) {
    lastCompletedSolution = find(resources, {
      slug: get(first(moduleProgress), 'lessonSlug'),
    })
  }

  const activeSection = first(
    filter(sections, ({lessons}, i) => {
      const lesson = find(lessons, {slug: lastCompletedExercise?.slug})
      return lesson
    }),
  )

  const isLastLessonInSection =
    indexOf(activeSection?.lessons, lastCompletedExercise) ===
    activeSection?.lessons.length - 1

  const nextSection = isLastLessonInSection
    ? getNextSection({
        module: module,
        currentSection: activeSection,
      })
    : activeSection

  const {
    data: nextExercise,
    status: nextExerciseStatus,
    refetch: refetchNextLesson,
  } = trpcSkillLessons.lessons.getNextLesson.useQuery({
    type: 'solution',
    slug: lastCompletedExercise?.slug,
    section: nextSection?.slug,
    module: module.slug.current,
  })

  const isCompleted = moduleProgress.length === resources.length
  const percentCompleted = Math.round(
    (moduleProgress.length / resources.length) * 100,
  )

  if (
    !isEmpty(
      find(moduleProgress, {
        // if explainer
        lessonSlug: get(find(exercises, {slug: nextExercise?.slug}), 'slug'),
      }) ||
        find(moduleProgress, {
          lessonSlug: get(
            find(exercises, {slug: nextExercise?.slug}),
            'solution.slug',
          ),
        }),
    )
  ) {
    setLastCompletedExercise(
      nextSection.lessons[
        indexOf(
          nextSection.lessons,
          find(nextSection.lessons, {slug: nextExercise?.slug}),
        )
      ],
    )
  }

  return {
    nextExercise: isEmpty(moduleProgress) ? first(exercises) : nextExercise,
    nextSection,
    isCompleted,
    percentCompleted,
    completedLessons: moduleProgress,
    status: nextExerciseStatus,
  }
}

export const useSectionProgress = ({section}: {section: SanityDocument}) => {
  const {data: userProgress} = trpcSkillLessons.progress.get.useQuery()
  const exercises = get(section, 'lessons')
  const resources = map(exercises, (l) => (l.solution ? l.solution : l))

  const sectionProgress = filter(userProgress, ({lessonSlug, completedAt}) => {
    if (!completedAt) return
    return find(resources, {slug: lessonSlug})
  })

  let lastCompletedExercise = first(exercises) as SanityDocument
  let lastCompletedSolution = first(resources)

  if (!isEmpty(sectionProgress)) {
    lastCompletedSolution = find(resources, {
      slug: get(first(sectionProgress), 'lessonSlug'),
    })
    lastCompletedExercise =
      // if explainer
      find(exercises, {
        slug: lastCompletedSolution.slug,
      }) ||
      find(exercises, {
        solution: lastCompletedSolution,
      })
  }

  const isLastLessonInSection =
    indexOf(section.lessons, lastCompletedExercise) ===
    section.lessons.length - 1

  const isCompleted = sectionProgress.length === resources.length
  const percentCompleted = Math.round(
    (sectionProgress.length / resources.length) * 100,
  )

  const {data: nextExercise, status: nextExerciseStatus} =
    trpcSkillLessons.lessons.getNextLesson.useQuery({
      type: 'solution',
      slug: lastCompletedExercise.slug,
      section: section.slug,
      //   module: module.slug.current,
    })

  return {
    section,
    nextExercise:
      isEmpty(sectionProgress) || isLastLessonInSection
        ? first(exercises)
        : nextExercise,
    completedLessons: sectionProgress,
    isCompleted,
    percentCompleted,
  }
}
