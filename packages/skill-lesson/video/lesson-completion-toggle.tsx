import * as Switch from '@radix-ui/react-switch'
import {useLesson} from 'hooks/use-lesson'
import {trpc} from 'trpc/trpc.client'
import {useRouter} from 'next/router'
import {motion} from 'framer-motion'
import toast from 'react-hot-toast'

const LessonCompletionToggle = () => {
  const {module} = useLesson()
  const router = useRouter()
  const lessonSlug = router.query.lesson
  const {
    data: moduleProgress,
    status: moduleProgressStatus,
    isFetching,
  } = trpc.moduleProgress.bySlug.useQuery({
    slug: module.slug.current,
  })

  const toggleProgressMutation = trpc.progress.toggle.useMutation()
  const completedLessons = moduleProgress?.lessons.filter(
    (l) => l.lessonCompleted,
  )

  // cannot use id because lesson from useLesson returns solution resource when on solution page
  const isLessonCompleted = Boolean(
    completedLessons?.find(({id, slug}) => slug === lessonSlug),
  )

  const handleToggleLessonProgress = () => {
    return toggleProgressMutation.mutate(
      {lessonSlug: lessonSlug as string},
      {
        onError: (error) => {
          toast.error(`Error setting lesson progress.`)
          console.debug(error.message)
        },
      },
    )
  }

  return (
    <div data-lesson-completion-toggle="">
      <form>
        <p data-title="">Finished this lesson?</p>
        <label data-fetching={isFetching.toString()}>
          <span data-label="">Mark as complete</span>
          <Switch.Root
            disabled={isFetching}
            onClick={handleToggleLessonProgress}
            checked={moduleProgressStatus === 'success' && isLessonCompleted}
          >
            <Switch.Thumb />
          </Switch.Root>
          {isFetching && (
            <motion.div
              data-loading-indicator=""
              animate={{
                width: ['0%', '100%', '100%'],
                opacity: [0.2, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeatDelay: 0.5,
                repeat: Infinity,
                type: 'spring',
              }}
              aria-hidden="true"
            />
          )}
        </label>
      </form>
    </div>
  )
}

export default LessonCompletionToggle
