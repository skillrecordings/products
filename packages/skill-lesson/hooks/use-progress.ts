import React from 'react'
import {SanityDocument} from '@sanity/client'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {first, filter, find, flatMap, get, indexOf, isEmpty, map} from 'lodash'
import {getNextSection} from '../utils/get-next-section'
import {LessonResource} from '../schemas/lesson-resource'
import {LessonProgress} from '@skillrecordings/database'

export type Exercise = LessonResource & {solution?: any}
export type Module = {
  sections: Section[]
  _id: string
  slug: {current: string}
  moduleType: string
}
export type Section = {lessons: Exercise[]; _id: string; slug: string}

export function extractExercisesAndResource(sections: Section[]) {
  const exercises = flatMap<Section, Exercise>(
    sections,
    (section) => section.lessons,
  )
  const resources = flatMap<Section, LessonResource>(sections, (section) =>
    map(section.lessons, (lesson: {solution?: any}) =>
      lesson.solution ? lesson.solution : lesson,
    ),
  )

  return {exercises, resources}
}

export const getLastCompletedSolution = ({
  resources,
  moduleProgress,
}: {
  resources: LessonResource[]
  moduleProgress: LessonProgress[]
}) => {
  return !isEmpty(moduleProgress)
    ? resources.find((resource) => {
        return resource.slug === get(first(moduleProgress), 'lessonSlug')
      })
    : first(resources)
}

export const getNextSectionAndModuleProgress = ({
  userProgress,
  resources,
  lastCompletedExercise,
  sections,
  module,
}: {
  sections: Section[]
  userProgress: LessonProgress[]
  resources: LessonResource[]
  lastCompletedExercise?: Exercise
  module: Module
}) => {
  const moduleProgress = userProgress.filter(({completedAt, lessonSlug}) => {
    if (!completedAt) return
    return find(resources, {slug: lessonSlug})
  })

  const activeSection = first(
    sections.filter(({lessons}) => {
      const lesson = find(lessons, {slug: lastCompletedExercise?.slug})
      return lesson
    }),
  )

  const isLastLessonInSection = activeSection?.lessons
    ? indexOf(activeSection?.lessons, lastCompletedExercise) ===
      activeSection?.lessons.length - 1
    : false

  const nextSection = isLastLessonInSection
    ? getNextSection({
        module: module,
        currentSection: activeSection,
      })
    : activeSection

  return {nextSection, moduleProgress}
}

export const getCompleted = ({
  resources,
  moduleProgress,
  exercises,
  nextExercise,
}: {
  resources: LessonResource[]
  moduleProgress: LessonProgress[]
  exercises: Exercise[]
  nextExercise?: LessonResource | null
}) => {
  const isCompleted = moduleProgress.length === resources.length
  const percentCompleted = Math.round(
    (moduleProgress.length / resources.length) * 100,
  )

  const hasProgress = !isEmpty(
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

  const lastCompletedSolution = getLastCompletedSolution({
    resources,
    moduleProgress,
  })

  return {isCompleted, percentCompleted, lastCompletedSolution, hasProgress}
}

export const useModuleProgress = ({module}: {module: Module}) => {
  const {sections} = module
  const {data: userProgress = [], status: userProgressStatus} =
    trpcSkillLessons.progress.get.useQuery()

  const {exercises, resources} = extractExercisesAndResource(sections)

  // storing this in state allows to refetch nextExercise
  // in case the original next is already completed
  const [lastCompletedExercise, setLastCompletedExercise] = React.useState(
    first(exercises),
  )

  const {nextSection, moduleProgress} = getNextSectionAndModuleProgress({
    userProgress,
    resources,
    lastCompletedExercise,
    sections,
    module,
  })

  const {data: nextExercise, status: nextExerciseStatus} =
    trpcSkillLessons.lessons.getNextLesson.useQuery({
      type: 'solution',
      slug: lastCompletedExercise?.slug,
      section: nextSection?.slug,
      module: module.slug.current,
    })

  const {isCompleted, percentCompleted, lastCompletedSolution, hasProgress} =
    getCompleted({
      resources,
      moduleProgress,
      exercises,
      nextExercise,
    })

  React.useEffect(() => {
    if (hasProgress && nextSection) {
      setLastCompletedExercise(
        nextSection.lessons[
          indexOf(
            nextSection.lessons,
            find(nextSection.lessons, {slug: nextExercise?.slug}),
          )
        ],
      )
    }
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
  }, [
    exercises,
    hasProgress,
    lastCompletedSolution,
    nextExercise?.slug,
    nextSection,
    userProgressStatus,
  ])

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
