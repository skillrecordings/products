import React from 'react'
import {first, filter, find, flatMap, get, indexOf, isEmpty} from 'lodash'
import {getNextSection} from '@skillrecordings/skill-lesson/utils/get-next-section'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {LessonProgress} from '@skillrecordings/database'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {trpcSkillLessons} from '@skillrecordings/skill-lesson/utils/trpc-skill-lessons'

export function getAllLessons(sections?: Section[] | null) {
  const lessons = flatMap<Section, Lesson>(
    sections,
    (section) => section?.lessons || [],
  )

  return lessons
}

const getCompletedLessons = ({
  userProgress,
  lessons,
}: {
  userProgress: LessonProgress[]
  lessons: Lesson[]
}) => {
  const completedLessons = userProgress.filter(({completedAt, lessonId}) => {
    if (!completedAt) return
    return find(lessons, {_id: lessonId})
  })
  const lastCompletedLesson = !isEmpty(completedLessons)
    ? lessons.find((lesson) => {
        return lesson._id === get(first(completedLessons), 'lessonId')
      })
    : first(lessons)

  return {lastCompletedLesson, completedLessons}
}

export const getNextSectionForProgress = ({
  lastCompletedLesson,
  sections,
  module,
}: {
  sections?: Section[] | null
  lastCompletedLesson?: Lesson | null
  module: Module
}) => {
  const activeSection =
    first(
      sections?.filter(({lessons}) => {
        const lesson = find(lessons, {slug: lastCompletedLesson?.slug})
        return lesson
      }),
    ) || null

  const isLastLessonInSection = activeSection?.lessons
    ? indexOf(activeSection?.lessons, lastCompletedLesson) ===
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

export const useModuleProgress = ({module}: {module: Module}) => {
  const {sections} = module
  const {data: userProgress = [], status: userProgressStatus} =
    trpcSkillLessons.progress.get.useQuery()

  const lessons = getAllLessons(sections)
  const {completedLessons, lastCompletedLesson} = getCompletedLessons({
    userProgress,
    lessons,
  })

  const nextSection = getNextSectionForProgress({
    lastCompletedLesson,
    sections,
    module,
  })

  const {data: nextLesson, status: nextLessonStatus} =
    trpcSkillLessons.lessons.getNextLesson.useQuery({
      type: 'solution',
      slug: lastCompletedLesson?.slug,
      section: nextSection?.slug,
      module: module.slug.current,
    })

  return {
    // slug used for linking to the next lesson
    // slug used to detrmine if lesson in list IS the next exercise
    nextLesson: isEmpty(completedLessons) ? first(lessons) : nextLesson,
    // slug used for linking to the next lesson
    // slug used to determine which section to display open
    nextSection,
    // used to determine if we have ANY completed lessons
    isModuleStarted: !isEmpty(completedLessons),
    isProgressLoaded:
      nextLessonStatus === 'success' && userProgressStatus === 'success',
    // used to determine if a specific lesson is completed
    completedLessons: completedLessons,
  }
}

export const useSectionProgress = ({section}: {section: Section}) => {
  const {data: userProgress} = trpcSkillLessons.progress.get.useQuery()
  const lessons = get(section, 'lessons') || []

  const completedLessonInSection = filter(
    userProgress,
    ({lessonId, completedAt}) => {
      if (!completedAt) return false
      return find(lessons, {_id: lessonId})
    },
  )

  const isCompleted = completedLessonInSection.length === lessons.length
  const percentCompleted = Math.round(
    (completedLessonInSection.length / lessons.length) * 100,
  )

  return {
    isCompleted,
    percentCompleted,
  }
}
