import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {useRouter} from 'next/router'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {trpc} from '@/trpc/trpc.client'

const GitpodLink = () => {
  const router = useRouter()
  const {lesson, module} = useLesson()
  const {data: resources} = trpc.lessonResources.byLessonSlug.useQuery({
    slug: router.query.lesson as string,
    type: lesson._type,
  })
  const gitpod = resources?.gitpod

  if (!gitpod) {
    return null
  }

  return (
    <div className="flex items-center gap-2" data-gitpod-link="">
      <a
        onClick={() => {
          track('clicked gitpod code link', {
            lesson: lesson.slug,
            module: module.slug.current,
            moduleType: module.moduleType,
            lessonType: lesson._type,
          })
        }}
        href={gitpod}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon name="Gitpod" size="24" />
        <div>
          <p>Gitpod</p>
          {/* <p className="font-mono text-sm text-gray-400">/{openFile}</p> */}
        </div>
      </a>
    </div>
  )
}

export default GitpodLink
