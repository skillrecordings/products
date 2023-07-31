import React from 'react'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import * as Dialog from '@radix-ui/react-dialog'
import {XIcon} from '@heroicons/react/outline'
import {Module} from '../schemas/module'
import toast from 'react-hot-toast'
import {cn} from '../ui/utils'

const ResetProgress: React.FC<{
  module: Module
  className?: string
  title?: (module: Module) => React.ReactElement
}> = ({
  module,
  className,
  title = (module) => (
    <>
      Are you sure you want to{' '}
      <strong className="font-semibold">reset all your progress</strong> in{' '}
      {module.title} {module.moduleType}?{' '}
      <span className="block pt-5">This cannot be undone.</span>
    </>
  ),
}) => {
  const progressResetMutation = trpcSkillLessons.progress.clear.useMutation()
  const [open, setOpen] = React.useState(false)
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpcSkillLessons.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })
  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const lessons = module.sections?.map((section) => section.lessons).flat()
  const handleProgressReset: React.MouseEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    if (lessons) {
      e.currentTarget.disabled = true
      progressResetMutation.mutate(
        {
          lessons: lessons.map((lesson) => ({
            id: lesson?._id as string,
            slug: lesson?.slug as string,
          })),
        },
        {
          onSuccess: () => {
            setOpen(false)
            toast.success('Progress reset!')
          },
        },
      )
    } else {
      toast.error('No lessons found')
    }
  }

  return (
    <div data-reset-progress="">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {moduleProgressStatus === 'success' && isModuleInProgress && (
          <Dialog.Trigger data-trigger="" className={cn(className)}>
            Reset Progress
          </Dialog.Trigger>
        )}
        <Dialog.Overlay data-overlay="" />
        <Dialog.Content data-content="">
          <Dialog.Title data-title="">{title(module)}</Dialog.Title>
          <div data-actions="">
            <button
              data-button-reset=""
              onClick={handleProgressReset}
              type="button"
            >
              Reset progress
            </button>
            <Dialog.Close asChild>
              <button data-button-cancel="" type="button">
                Cancel
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button data-button-close="" type="button" aria-label="Close">
              <XIcon aria-hidden="true" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  )
}

export default ResetProgress
