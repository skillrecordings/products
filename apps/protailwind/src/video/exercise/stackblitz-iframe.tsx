import * as React from 'react'
import {SanityDocument} from '@sanity/client'
import cx from 'classnames'
import Spinner from '../../components/spinner'
import Image from 'next/image'
import {LessonResource} from '@skillrecordings/skill-lesson/schemas/lesson-resource'
import {trpc} from '../../utils/trpc'
import {useRouter} from 'next/router'

export const StackBlitzIframe: React.FC<{
  exercise: LessonResource
  module: SanityDocument
  isExpanded?: boolean
}> = ({exercise, module}) => {
  const router = useRouter()
  const {data: stackblitz, status} = trpc.stackblitz.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: exercise._type,
  })

  const [isLoading, setIsLoading] = React.useState(true)

  const githubOrg = 'total-typescript'
  const githubRepo = module.github.repo
  const clickToLoad = Number(false)
  const startCommand = getStartCommand(exercise, stackblitz)
  const embedUrl = `https://stackblitz.com/github/${githubOrg}/${githubRepo}?file=${stackblitz}&embed=1&view=editor&hideExplorer=1&ctl=${clickToLoad}&terminal=${startCommand}`

  return status === 'loading' ? null : (
    <>
      <iframe
        key={stackblitz}
        onLoad={() => {
          setIsLoading(false)
        }}
        src={embedUrl}
        title="code editor"
        className={cx('h-full w-full transition-all', {
          invisible: isLoading,
        })}
      />
      {isLoading && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[#070B15]">
          <div className="relative z-10 flex items-center justify-center gap-2">
            <Spinner className="h-8 w-8" />
            <span>Loading editor...</span>
          </div>
          <Image
            src={require('../../../public/assets/editor-placeholder.svg')}
            layout="fill"
            className="object-cover object-left-top"
          />
        </div>
      )}
    </>
  )
}

// Figures out start command: e.g. s-01, e-02, etc
export const getStartCommand = (
  exercise: {_type: string},
  stackblitz: string | null | undefined,
) => {
  // Reasonably sensbile fallback, not sure
  // what we should do when Stacblitz is not defined
  if (!stackblitz) return 'e-01'

  const stackblitzSplit = stackblitz.split('/')

  const lastPathPart = stackblitzSplit[stackblitzSplit.length - 1]

  const codeFileNumber = lastPathPart.split('-')[0]

  const startCommand = `${exercise._type.substring(0, 1)}-${codeFileNumber}`

  return startCommand
}
