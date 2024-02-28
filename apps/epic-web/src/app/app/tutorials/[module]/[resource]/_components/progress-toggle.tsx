'use client'
import {trpcSkillLessons} from '@skillrecordings/skill-lesson/utils/trpc-skill-lessons'
import {revalidatePath} from 'next/cache'

export const ProgressToggle: React.FC<{
  session: any
  params: {resource: string}
}> = ({session, params}) => {
  const toggleProgress = trpcSkillLessons.progress.toggle.useMutation()
  return (
    <button
      type="button"
      onClick={async (event) => {
        event.preventDefault()
        // mark progress as complete
        toggleProgress.mutate({
          lessonSlug: params?.resource,
        })
      }}
    >
      Toggle progress
    </button>
  )
}
