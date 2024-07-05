import * as React from 'react'
import cx from 'classnames'
import Spinner from '../components/spinner'
import Image from 'next/image'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {trpc} from '../trpc/trpc.client'
import {useRouter} from 'next/router'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'

export const StackBlitzIframe: React.FC<{
  exercise: Lesson
  module: Module
  isExpanded?: boolean
}> = ({exercise, module}) => {
  const router = useRouter()
  const {data: stackblitz, status} = trpc.stackblitz.byExerciseSlug.useQuery({
    slug: router.query.lesson as string,
    type: exercise._type,
  })

  const [isLoading, setIsLoading] = React.useState(true)
  const embedUrl = getStackblitzUrl({module, exercise, stackblitz})

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
            alt=""
            aria-hidden="true"
            src={require('../../public/assets/editor-placeholder.svg')}
            fill
            className="object-cover object-left-top"
          />
        </div>
      )}
    </>
  )
}

const findAllPathPartsStartingWithANumber = (path: string) => {
  const split = path.split('/')

  return split.filter((part) => {
    const firstChar = part[0]
    return !isNaN(Number(firstChar))
  })
}

const findLastPathPartStartingWithANumber = (path: string) => {
  const parts = findAllPathPartsStartingWithANumber(path)

  return parts[parts.length - 1]
}

const DEFAULT = 'e-01'

// Figures out start command: e.g. s-01, e-02, etc
export const getStartCommand = (
  exercise: {_type: string},
  fileUrl: string | null | undefined,
) => {
  // Reasonably sensbile fallback, not sure
  // what we should do when Stacblitz is not defined
  if (!fileUrl) return DEFAULT

  const pathPart = findLastPathPartStartingWithANumber(fileUrl)

  if (!pathPart) return DEFAULT

  const codeFileNumber = pathPart.split('-')[0]

  const startCommand = `${exercise._type.substring(0, 1)}-${codeFileNumber}`

  return startCommand
}

export const SECTION_NOT_DETECTED = Symbol('SECTION_NOT_DETECTED')

export const getSectionNumFromPath = (path: string | null | undefined) => {
  if (!path) return SECTION_NOT_DETECTED

  const pathPartsStartingWithNumber = findAllPathPartsStartingWithANumber(path)
  const secondToLastPart =
    pathPartsStartingWithNumber[pathPartsStartingWithNumber.length - 2]

  if (!secondToLastPart) return SECTION_NOT_DETECTED

  const sectionNum = secondToLastPart.split('-')[0]!

  return sectionNum
}

// TODO - delete once all repos have section repo creation set up
export const REPOS_WITH_SECTIONS = ['pro-essentials-workshop']

export const getStackblitzUrl = ({
  module,
  exercise,
  stackblitz,
  isEmbed = Number(true),
}: {
  module: Module
  exercise: Lesson
  stackblitz: string | null | undefined
  isEmbed?: number
}) => {
  const sectionNum = getSectionNumFromPath(stackblitz)
  /**
   * If the repo uses sections (not all of them do), then
   * we need to append the section number to the repo name
   * and grab them from the mattpocock github user.
   *
   * This is because sections are being created as separate
   * repos in the mattpocock github account to save on
   * Stackblitz loading time.
   */
  const usesSections =
    sectionNum !== SECTION_NOT_DETECTED &&
    REPOS_WITH_SECTIONS.includes(module.github?.repo!!!)

  const githubOrg = usesSections ? 'mattpocock' : 'total-typescript'
  const githubRepo = usesSections
    ? `${module.github?.repo}-${sectionNum}`
    : module.github?.repo
  const clickToLoad = Number(false)
  const startCommand = getStartCommand(exercise, stackblitz)
  const embedUrl = `https://stackblitz.com/github/${githubOrg}/${githubRepo}?file=${stackblitz}&embed=${isEmbed}&view=editor&hideExplorer=1&ctl=${clickToLoad}&terminal=${startCommand}`
  return embedUrl
}
