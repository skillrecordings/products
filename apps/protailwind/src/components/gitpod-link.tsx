import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {useRouter} from 'next/router'
import {track} from 'utils/analytics'
import {trpc} from 'trpc/trpc.client'

const GitpodLink = () => {
  const router = useRouter()
  const {lesson, module} = useLesson()
  const {data: resources} = trpc.resources.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: lesson._type,
  })
  const gitpod = resources?.gitpod

  if (!gitpod) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <a
        onClick={() => {
          track('clicked gitpod code link', {
            lesson: lesson.slug,
            module: module.slug.current,
            moduleType: module.moduleType,
            lessonType: lesson._type,
          })
        }}
        href={gitpod.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-lg font-medium text-white transition hover:bg-gray-900"
      >
        <Icon name="Gitpod" size="24" />
        <div>
          <p className="font-semibold">Gitpod</p>
          {/* <p className="font-mono text-sm text-gray-400">/{openFile}</p> */}
        </div>
      </a>
    </div>
  )
}

export default GitpodLink
