import {getModuleStructure, ResourceStructure} from './modules'
import {LessonProgress, prisma} from '@skillrecordings/database'
import {sortBy, uniqBy, isEmpty} from 'lodash'
import {ModuleProgressSchema} from '../video/module-progress'

function sortByUpdatedAt(lessons: LessonProgress[]) {
  return sortBy(lessons, ['updatedAt']).reverse()
}

export async function getModuleProgress({
  moduleSlug,
  userId,
}: {
  moduleSlug: string
  userId: string
}) {
  const module = await getModuleStructure(moduleSlug)

  type LessonStructure = NonNullable<ResourceStructure['resources']>[0]

  const allModuleSections: Array<ResourceStructure> = []
  const allModuleLessons: Array<LessonStructure> = []
  for (const resource of module.resources) {
    if (resource._type === 'section') {
      allModuleSections.push(resource)

      for (const lesson of resource.resources || []) {
        allModuleLessons.push(lesson)
      }
    } else {
      allModuleLessons.push(resource)
    }
  }

  const lessonIds = allModuleLessons.map((lesson) => lesson._id)

  const moduleLessonProgress = await prisma.lessonProgress.findMany({
    where: {
      lessonId: {in: lessonIds},
      userId,
    },
  })

  const sortedModuleLessonProgress = sortByUpdatedAt(moduleLessonProgress)

  const filteredModuleLessonProgress = uniqBy(
    sortedModuleLessonProgress,
    'lessonId',
  )

  const moduleProgressLessons = allModuleLessons.map((lesson) => {
    return {
      id: lesson._id,
      slug: lesson.slug,
      title: lesson.title,
      lessonCompleted: Boolean(
        filteredModuleLessonProgress.find(
          (progress) =>
            progress.lessonId === lesson._id && progress.completedAt,
        ),
      ),
    }
  })

  const latestCompletedLesson = [...filteredModuleLessonProgress]
    .sort(
      (a, b) =>
        (b?.completedAt?.getTime() || 0) - (a?.completedAt?.getTime() || 0),
    )
    .shift()

  const moduleProgressSections = allModuleSections
    .filter((section) => !isEmpty(section.resources))
    .map((section) => {
      const sectionProgressLessons =
        section.resources?.map((lesson) => {
          return {
            id: lesson._id,
            slug: lesson.slug,
            title: lesson.title,
            lessonCompleted: Boolean(
              moduleLessonProgress.find(
                (progress) =>
                  progress.lessonId === lesson._id && progress.completedAt,
              ),
            ),
          }
        }) || []

      return {
        id: section._id,
        slug: section.slug,
        title: section.title,
        sectionCompleted: sectionProgressLessons.every(
          (lesson) => lesson.lessonCompleted,
        ),
        percentComplete: Math.round(
          (sectionProgressLessons.filter((lesson) => lesson.lessonCompleted)
            .length /
            sectionProgressLessons.length) *
            100,
        ),
        completedLessonCount: sectionProgressLessons.filter(
          (lesson) => lesson.lessonCompleted,
        ).length,
        lessonCount: sectionProgressLessons.length,
        lessons: sectionProgressLessons,
      }
    })

  const hasEmptySection = allModuleSections.some((section) => {
    return isEmpty(section.resources)
  })

  const moduleCompleted = hasEmptySection
    ? false // if there are empty sections, we consider the module incomplete
    : moduleProgressLessons.every((lesson) => lesson.lessonCompleted)

  return ModuleProgressSchema.parse({
    moduleId: module._id,
    nextLesson:
      moduleProgressLessons.find((lesson) => !lesson.lessonCompleted) || null,
    nextSection:
      moduleProgressSections.find((section) => !section.sectionCompleted) ||
      null,
    moduleCompleted,
    percentComplete: Math.round(
      (moduleLessonProgress.length / allModuleLessons.length) * 100,
    ),
    completedLessonCount: moduleLessonProgress.filter(
      (lesson) => lesson.completedAt,
    ).length,
    lessonCount: allModuleLessons.length,
    lessons: moduleProgressLessons,
    sections: moduleProgressSections,
    moduleCompletedAt: moduleCompleted
      ? latestCompletedLesson?.completedAt
      : null,
  })
}
