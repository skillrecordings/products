import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import Icon from 'components/icons'
import {useRouter} from 'next/router'
import {trpc} from 'utils/trpc'
import GitHubLink from './github-link'

const LessonAssets = () => {
  const {lesson, module} = useLesson()
  const router = useRouter()
  const {data: resources} = trpc.resources.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: lesson._type,
  })
  const figma = resources?.figma
  const github = resources?.github

  return figma || github ? (
    <div className="flex flex-wrap items-center gap-2 pb-8">
      {figma?.url && (
        <a
          href={figma.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/5 bg-indigo-50 px-4 py-2 text-lg font-semibold text-indigo-600 transition hover:bg-indigo-100/80"
        >
          <Icon name="Figma" size="20" className="text-indigo-600" />
          <span>Design assets</span>
        </a>
      )}
      <GitHubLink />
    </div>
  ) : null
}

export default LessonAssets
