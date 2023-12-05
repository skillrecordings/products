import React from 'react'
import * as Switch from '@radix-ui/react-switch'
import {useLesson} from '../hooks/use-lesson'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import {useRouter} from 'next/router'
import toast from 'react-hot-toast'
import {cn} from '../utils/cn'

const LessonCompletionToggle: React.FC<
  React.PropsWithChildren<{className?: string}>
> = ({className, children}) => {
  return (
    <div data-lesson-completion-toggle="">
      {children ? (
        <form className={cn(className)}>{children}</form>
      ) : (
        <form>
          <p data-title="">Finished this lesson?</p>
          <Toggle>Mark as complete</Toggle>
        </form>
      )}
    </div>
  )
}

export default LessonCompletionToggle

const Toggle: React.FC<React.PropsWithChildren<{className?: string}>> = ({
  children,
  className,
}) => {
  const {module} = useLesson()
  const router = useRouter()
  const lessonSlug = router.query.lesson
  const {
    data: moduleProgress,
    status: moduleProgressStatus,
    isFetching,
  } = trpcSkillLessons.moduleProgress.bySlug.useQuery({
    slug: module.slug.current,
  })

  const toggleProgressMutation = trpcSkillLessons.progress.toggle.useMutation()
  const completedLessons = moduleProgress?.lessons.filter(
    (l: any) => l.lessonCompleted,
  )

  // cannot use id because lesson from useLesson returns solution resource when on solution page
  const isLessonCompleted = Boolean(
    completedLessons?.find(({id, slug}: any) => slug === lessonSlug),
  )

  const [optimisticallyToggled, setOptimisticallyToggled] = React.useState(
    isLessonCompleted || false,
  )

  React.useEffect(() => {
    moduleProgressStatus === 'success' &&
      setOptimisticallyToggled(isLessonCompleted)
  }, [moduleProgressStatus, isLessonCompleted])

  const handleToggleLessonProgress = () => {
    setOptimisticallyToggled(!optimisticallyToggled)

    return toggleProgressMutation.mutate(
      {
        lessonSlug: lessonSlug as string,
      },
      {
        onError: (error) => {
          setOptimisticallyToggled((value) => !value)
          toast.error(`Error setting lesson progress.`)
          console.debug(error.message)
        },
      },
    )
  }
  return (
    <label className={className} data-fetching={isFetching.toString()}>
      <span data-label="">{children ? children : 'Mark as completed'}</span>
      <Switch.Root
        disabled={isFetching}
        onClick={handleToggleLessonProgress}
        checked={optimisticallyToggled}
      >
        <Switch.Thumb />
      </Switch.Root>
    </label>
  )
}

const Root = LessonCompletionToggle

export {Root, Toggle}
