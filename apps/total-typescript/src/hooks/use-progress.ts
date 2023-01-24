import React from 'react'
import {
  first,
  filter,
  find,
  flatMap,
  get,
  indexOf,
  isEmpty,
  map,
  isArray,
} from 'lodash'
import {getNextSection} from '@skillrecordings/skill-lesson/utils/get-next-section'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {LessonProgress} from '@skillrecordings/database'
import {Exercise} from '@skillrecordings/skill-lesson/schemas/exercise'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {trpcSkillLessons} from '@skillrecordings/skill-lesson/utils/trpc-skill-lessons'

export function extractExercisesAndResource(sections?: Section[] | null) {
  const exercises = flatMap<Section, Exercise>(
    sections,
    (section) => section?.lessons || [],
  )
  const resources = flatMap<Section, Lesson>(sections, (section) =>
    map(section.lessons, (lesson: {solution?: any}) =>
      lesson.solution ? lesson.solution : lesson,
    ),
  )

  return {exercises, resources}
}

export const getLastCompletedSolution = ({
  resources,
  completedResources,
}: {
  resources: Lesson[]
  completedResources: LessonProgress[]
}) => {
  return !isEmpty(completedResources)
    ? resources.find((resource) => {
        return resource.slug === get(first(completedResources), 'lessonSlug')
      })
    : first(resources)
}

const getCompletedResources = ({
  userProgress,
  resources,
}: {
  userProgress: LessonProgress[]
  resources: Lesson[]
}) => {
  const completedResources = userProgress.filter(
    ({completedAt, lessonSlug}) => {
      if (!completedAt) return
      return find(resources, {slug: lessonSlug})
    },
  )
  return completedResources
}

export const getNextSectionForProgress = ({
  userProgress,
  resources,
  lastCompletedExercise,
  sections,
  module,
}: {
  sections?: Section[] | null
  userProgress: LessonProgress[]
  resources: Lesson[]
  lastCompletedExercise?: Lesson | null
  module: Module
}) => {
  const activeSection =
    first(
      sections?.filter(({lessons}) => {
        const lesson = find(lessons, {slug: lastCompletedExercise?.slug})
        return lesson
      }),
    ) || null

  const isLastLessonInSection = activeSection?.lessons
    ? indexOf(activeSection?.lessons, lastCompletedExercise) ===
      activeSection?.lessons.length - 1
    : false

  const nextSection =
    activeSection && isLastLessonInSection
      ? getNextSection({
          module: module,
          currentSection: activeSection,
        })
      : activeSection

  return nextSection
}

export const getProgress = ({
  resources,
  completedResources,
  exercises,
  nextExercise,
}: {
  resources: Lesson[]
  completedResources: LessonProgress[]
  exercises: Exercise[]
  nextExercise?: Lesson | null
}) => {
  const isCompleted = completedResources.length === resources.length
  const percentCompleted = Math.round(
    (completedResources.length / resources.length) * 100,
  )

  const hasProgress = !isEmpty(
    find(completedResources, {
      // if explainer
      lessonSlug: get(find(exercises, {slug: nextExercise?.slug}), 'slug'),
    }) ||
      find(completedResources, {
        lessonSlug: get(
          find(exercises, {slug: nextExercise?.slug}),
          'solution.slug',
        ),
      }),
  )

  const lastCompletedSolution = getLastCompletedSolution({
    resources,
    completedResources,
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
  const [lastCompletedExercise, setLastCompletedExercise] = React.useState<
    Lesson | null | undefined
  >(first(exercises))

  const completedResources = getCompletedResources({userProgress, resources})

  const nextSection = getNextSectionForProgress({
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
    getProgress({
      resources,
      completedResources,
      exercises,
      nextExercise,
    })

  React.useEffect(() => {
    const lessons = nextSection?.lessons
    if (hasProgress && nextSection) {
      setLastCompletedExercise(
        lessons
          ? lessons[indexOf(lessons, find(lessons, {slug: nextExercise?.slug}))]
          : null,
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

  // {
  //   module: slug.current,
  //     section:
  //   moduleProgress.completedLessons.length > 0
  //     ? moduleProgress?.nextSection?.slug
  //     : firstSection.slug,
  //     lesson:
  //   moduleProgress.completedLessons.length > 0
  //     ? moduleProgress?.nextExercise?.slug
  //     : firstExercise?.slug,
  // }
  // module progress is used to derive a link to START or CONTINUE learning
  // based on the current progress

  // const [openedSections, setOpenedSections] = React.useState<string[]>()
  // React.useEffect(() => {
  //   nextSection?.slug && setOpenedSections([nextSection?.slug])
  // }, [moduleProgressStatus, nextSection?.slug])
  // module progress is used to open sections on the list of modules

  // const isExerciseCompleted =
  //   isArray(completedLessons) && lessonResource._type === 'exercise'
  //     ? find(completedLessons, ({lessonSlug}) => lessonSlug === solution?.slug)
  //     : find(
  //       completedLessons,
  //       ({lessonSlug}) => lessonSlug === lessonResource.slug,
  //     )
  // const isNextExercise = nextExercise?.slug === lessonResource.slug
  // module progress is used to determine if a lesson is completed or not

  return {
    nextExercise: isEmpty(completedResources) ? first(exercises) : nextExercise,
    nextSection,
    isCompleted,
    percentCompleted,
    completedLessons: completedResources,
    status: nextExerciseStatus,
  }
}

export const useSectionProgress = ({section}: {section: Section}) => {
  const {data: userProgress} = trpcSkillLessons.progress.get.useQuery()
  const exercises = get(section, 'lessons')
  const resources = map(exercises, (l) => (l.solution ? l.solution : l))

  const sectionProgress = filter(userProgress, ({lessonSlug, completedAt}) => {
    if (!completedAt) return
    return find(resources, {slug: lessonSlug})
  })

  let lastCompletedExercise = first<Exercise>(exercises) || null
  let lastCompletedSolution = first(resources)

  if (!isEmpty(sectionProgress)) {
    lastCompletedSolution = find(resources, {
      slug: get(first(sectionProgress), 'lessonSlug'),
    })
    lastCompletedExercise =
      // if explainer
      find(exercises, {
        slug: lastCompletedSolution?.slug,
      }) ||
      find(exercises, {
        solution: lastCompletedSolution,
      }) ||
      null
  }

  const isLastLessonInSection =
    section.lessons &&
    indexOf(section.lessons, lastCompletedExercise) ===
      section.lessons.length - 1

  const isCompleted = sectionProgress.length === resources.length
  const percentCompleted = Math.round(
    (sectionProgress.length / resources.length) * 100,
  )

  const {data: nextExercise, status: nextExerciseStatus} =
    trpcSkillLessons.lessons.getNextLesson.useQuery({
      type: 'solution',
      slug: lastCompletedExercise?.slug,
      section: section.slug,
      //   module: module.slug.current,
    })

  // const sectionProgress = useSectionProgress({section: section})
  // section progress is used to display the percentage a section is completed

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
