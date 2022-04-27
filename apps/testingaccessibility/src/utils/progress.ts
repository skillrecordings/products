import {LessonProgress} from '@prisma/client'
import {SanityDocument} from '@sanity/client'
import axios from 'axios'

type ProgressProps = {
  slug: string
}

export const toggleLessonProgressForUser = async ({slug}: ProgressProps) =>
  await axios
    .post(`/api/progress/lessons/${slug}`)
    .catch(() => {
      throw new Error('failed to set progress')
    })
    .then((data) => {
      console.debug('progress set')
      return data
    })

export const getLessonProgressForUser = async () =>
  await axios
    .get(`/api/progress`)
    .catch(() => {
      throw new Error('failed to load progress')
    })
    .then(({data}) => {
      console.debug('progress loaded', data)
      return data
    })

export const getSectionProgressForUser = (
  progress: LessonProgress[],
  sectionLessons: SanityDocument[],
) => {
  if (!progress || !sectionLessons) {
    return {}
  }
  const sectionLessonsSlugs: string[] = sectionLessons.map(({slug}) => slug)
  const completedLessonsInSection = progress.filter(
    ({lessonSlug, completedAt}) =>
      sectionLessonsSlugs.includes(lessonSlug) && completedAt,
  )
  const numberOfLessons = sectionLessons.length
  const numberOfCompletedLessons = completedLessonsInSection.length
  const isCompleted = numberOfCompletedLessons === numberOfLessons
  const percentCompleted = Math.round(
    (100 * numberOfCompletedLessons) / numberOfLessons,
  )

  return {
    completedLessons: completedLessonsInSection,
    percentCompleted,
    isCompleted,
  }
}

export const getModuleProgressForUser = (
  progress: LessonProgress[],
  moduleSections: SanityDocument[],
) => {
  if (!progress || !moduleSections) {
    return {}
  }

  let completedSectionsInModule: string[] = []

  moduleSections.forEach((section) => {
    const {isCompleted: isSectionCompleted} = getSectionProgressForUser(
      progress,
      section.lessons,
    )
    if (isSectionCompleted) {
      return completedSectionsInModule.push(section.slug)
    }
  })

  const numberOfSections = moduleSections.length
  const numberOfCompletedSections = completedSectionsInModule.length
  const isCompleted = numberOfCompletedSections === numberOfSections
  const percentCompleted = Math.round(
    (100 * numberOfCompletedSections) / numberOfSections,
  )

  return {
    completedSections: completedSectionsInModule,
    percentCompleted,
    isCompleted,
  }
}
