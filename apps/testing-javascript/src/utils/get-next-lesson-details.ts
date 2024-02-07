export const getNextLessonDetails = ({
  firstLessonSlug,
  nextLessonSlug,
  moduleCompleted,
  completedLessonCount,
}: {
  firstLessonSlug: string
  nextLessonSlug: string | undefined
  moduleCompleted: boolean
  completedLessonCount: number
}) => {
  // Three Options Are:
  //
  // 1. if the module has been completed
  //    - 'Watch Again'
  //    - nextLessonSlug is firstLessonSlug
  //
  // 2. if the module has not been started
  //    - 'Start Watching'
  //    - nextLessonSlug is firstLessonSlug
  //
  // 3. if the module has been started
  //    - 'Continue Watching'
  //    - nextLessonSlug is nextLessonSlug

  if (moduleCompleted) {
    return {
      status: 'MODULE_COMPLETED' as const,
      buttonText: 'Watch Again',
      nextLessonSlug: firstLessonSlug,
    }
  }

  if (completedLessonCount > 0) {
    return {
      status: 'MODULE_IN_PROGRESS' as const,
      buttonText: 'Continue Watching',
      nextLessonSlug,
    }
  }

  return {
    status: 'MODULE_UNSTARTED' as const,
    buttonText: 'Start Watching',
    nextLessonSlug: firstLessonSlug,
  }
}
