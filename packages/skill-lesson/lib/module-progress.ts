import {getModuleStructure} from './modules'
import {LessonProgress, prisma} from '@skillrecordings/database'
import {sortBy, uniqBy} from 'lodash'
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

  const allModuleLessons =
    module.sections.length > 0
      ? module.sections
          .filter((section) => section?.lessons?.length)
          .flatMap((section) => section.lessons)
      : module.lessons

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

  const moduleProgressSections = module.sections
    .filter((section) => section.lessons)
    .map((section) => {
      const sectionProgressLessons =
        section.lessons?.map((lesson) => {
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

  const hasEmptySection = module.sections.some((section) => {
    return !section.lessons
  })

  return ModuleProgressSchema.parse({
    moduleId: module._id,
    nextLesson:
      moduleProgressLessons.find(
        (lesson: {lessonCompleted: boolean}) => !lesson.lessonCompleted,
      ) || null,
    nextSection:
      moduleProgressSections.find(
        (section: {sectionCompleted: boolean}) => !section.sectionCompleted,
      ) || null,
    moduleCompleted: hasEmptySection
      ? false // if there are empty sections, we consider the module incomplete
      : moduleProgressLessons.every(
          (lesson: {lessonCompleted: boolean}) => lesson.lessonCompleted,
        ),
    percentComplete: Math.round(
      (moduleLessonProgress.length / allModuleLessons.length) * 100,
    ),
    completedLessonCount: moduleLessonProgress.filter(
      (lesson) => lesson.completedAt,
    ).length,
    lessonCount: allModuleLessons.length,
    lessons: moduleProgressLessons,
    sections: moduleProgressSections,
  })
}
