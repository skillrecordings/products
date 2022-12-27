import * as React from 'react'
import {SanityDocument} from '@sanity/client'
import {track} from '../../utils/analytics'
import {IconGithub} from '../icons'
import {useMuxPlayer} from '../../hooks/use-mux-player'
import Spinner from 'components/spinner'
import {LessonResource} from '../../lib/lesson-resources'
import {useRouter} from 'next/router'
import {trpc} from '../../utils/trpc'

export const GitHubLink: React.FC<{
  exercise: LessonResource
  module: SanityDocument
}> = ({exercise, module}) => {
  const {github} = module

  const {canShowVideo, loadingUserStatus} = useMuxPlayer()

  const router = useRouter()
  const {data: stackblitz, status} = trpc.stackblitz.byExerciseSlug.useQuery({
    slug: router.query.exercise as string,
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

  const openFile = stackblitz?.split(',')[0]

  return (
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
          href={`https://github.com/total-typescript/${github.repo}/blob/main/${openFile}`}
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
  )
}
