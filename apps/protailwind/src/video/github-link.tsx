import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import Icon from 'components/icons'
import {useRouter} from 'next/router'
import {track} from 'utils/analytics'
import {trpc} from 'utils/trpc'

const GitHubLink = () => {
  const router = useRouter()
  const {lesson, module} = useLesson()
  const {data: resources} = trpc.resources.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: lesson._type,
  })
  const github = resources?.github

  if (!github) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <a
        onClick={() => {
          track('clicked github code link', {
            lesson: lesson.slug,
            module: module.slug.current,
            moduleType: module.moduleType,
            lessonType: lesson._type,
          })
        }}
        href={github.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-gray-800 py-2 px-4 text-lg font-medium text-white transition hover:bg-gray-900"
      >
        <Icon name="Github" size="24" />
        <div>
          <p className="font-semibold">Code</p>
          {/* <p className="font-mono text-sm text-gray-400">/{openFile}</p> */}
        </div>
      </a>
    </div>
  )
}

export default GitHubLink
