import * as Switch from '@radix-ui/react-switch'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {trpc} from 'trpc/trpc.client'
import {useRouter} from 'next/router'
import {motion} from 'framer-motion'
import cx from 'classnames'
import toast from 'react-hot-toast'

const LessonCompletionToggle = () => {
  const {module} = useLesson()
  const router = useRouter()
  const lessonSlug = router.query.lesson
  const {
    data: moduleProgress,
    status: moduleProgressStatus,
    refetch,
    isFetching,
  } = trpc.moduleProgress.bySlug.useQuery({
    slug: module.slug.current,
  })
  const toggleProgressMutation = trpc.progress.toggle.useMutation()
  const utils = trpc.useContext()
  const completedLessons = moduleProgress?.lessons.filter(
    (l) => l.lessonCompleted,
  )

  // couldnt use id because lesson from useLesson returns solution resource when on solution page
  const isLessonCompleted = Boolean(
    completedLessons?.find(({id, slug}) => slug === lessonSlug),
  )

  const handleToggleLessonProgress = () => {
    return toggleProgressMutation.mutate(
      {lessonSlug: lessonSlug as string},
      {
        onSettled: (data, error, variables, context) => {
          refetch()
          utils.moduleProgress.bySlug.invalidate({
            slug: module.slug.current,
          })
        },
        onError: (error) => {
          toast.error(`Error setting lesson progress.`)
          console.debug(error.message)
        },
      },
    )
  }

  return (
    <form className="absolute right-3 top-3 z-20">
      <label
        className={cx(
          'group relative inline-flex items-center overflow-hidden rounded bg-gray-800/0 py-1.5 pl-2 pr-1.5',
          {
            'hover:cursor-pointer': !isFetching,
            'hover:cursor-wait': isFetching,
          },
        )}
      >
        <span className="pr-3 text-xs font-medium uppercase tracking-wide text-gray-300 transition group-hover:text-white lg:text-sm">
          Complete
        </span>
        <Switch.Root
          disabled={isFetching}
          onClick={handleToggleLessonProgress}
          checked={moduleProgressStatus === 'success' && isLessonCompleted}
          className={cx(
            'relative h-5 w-10 rounded-full border border-gray-700/50 bg-gray-800 shadow-md shadow-black/50 radix-state-checked:border-cyan-400 radix-state-checked:bg-cyan-500',
            {
              'animate-pulse': isFetching,
            },
          )}
        >
          <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-gray-200 shadow-sm shadow-black/50 transition-all ease-out group-hover:translate-x-1 group-hover:bg-white radix-state-checked:translate-x-5 radix-state-checked:bg-white radix-state-checked:group-hover:translate-x-5" />
        </Switch.Root>
        {isFetching && (
          <motion.div
            animate={{
              width: ['0%', '100%', '100%'],
              opacity: [0.2, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeatDelay: 0.5,
              repeat: Infinity,
            }}
            className="absolute left-0 h-full bg-white/10"
            aria-hidden="true"
          />
        )}
      </label>
    </form>
  )
}

export default LessonCompletionToggle
