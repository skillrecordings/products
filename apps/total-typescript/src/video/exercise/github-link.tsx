import * as React from 'react'
import {SanityDocument} from '@sanity/client'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {IconGithub} from '../../components/icons'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import Spinner from 'components/spinner'
import {LessonResource} from '@skillrecordings/skill-lesson/schemas/lesson-resource'
import {useRouter} from 'next/router'
import {trpc} from '../../trpc/trpc.client'

export const GitHubLink: React.FC<{
  exercise: LessonResource
  module: SanityDocument
}> = ({exercise, module}) => {
  const {github} = module

  const {canShowVideo, loadingUserStatus} = useMuxPlayer()

  const router = useRouter()
  const {data: stackblitz, status} = trpc.stackblitz.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: exercise._type,
  })

  if (loadingUserStatus || status === 'loading') {
    return (
      <div className="flex w-full items-center justify-center py-12">
        <Spinner className="h-7 w-7" />
      </div>
    )
  }

  if (!canShowVideo || !github || !stackblitz) {
    return null
  }

  const {exerciseGitHubUrl, openFile} = getExerciseGitHubUrl({
    stackblitz,
    module,
  })

  return github.repo && module.github.repo ? (
    <div className="pb-4">
      <div className="flex items-center gap-2">
        <a
          onClick={() => {
            track('clicked github code link', {
              lesson: exercise.slug,
              module: module.slug.current,
              moduleType: module.moduleType,
              lessonType: exercise._type,
            })
          }}
          href={exerciseGitHubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-4 rounded border border-gray-700/50 bg-gray-800/50 py-5 px-6 text-lg font-medium text-white transition hover:bg-slate-800/90"
        >
          <IconGithub className="h-14 w-14" />
          <div>
            <p className="text-xl font-semibold">
              {module.github.repo}
              <span className="font-medium text-gray-400"></span>
            </p>
            <p className="font-mono text-sm text-gray-400">/{openFile}</p>
          </div>
        </a>
      </div>
    </div>
  ) : null
}

export const getExerciseGitHubUrl = ({
  stackblitz,
  module,
}: {
  stackblitz: string | null | undefined
  module: SanityDocument
}) => {
  const openFile = stackblitz?.split(',')[0]
  const exerciseGitHubUrl = `https://github.com/total-typescript/${module.github.repo}/blob/main/${openFile}`
  return {exerciseGitHubUrl, openFile}
}
