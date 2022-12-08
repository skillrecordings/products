import * as React from 'react'
import {Exercise} from 'lib/exercises'
import {SanityDocument} from '@sanity/client'
import cx from 'classnames'
import Spinner from '../spinner'
import Image from 'next/image'
import {useMuxPlayer} from '../../hooks/use-mux-player'

export const StackBlitzIframe: React.FC<{
  exercise: Exercise
  module: SanityDocument
  isExpanded?: boolean
}> = ({exercise, module}) => {
  const {lessonMedia} = useMuxPlayer()
  const stackblitz = lessonMedia?.stackblitz
  const [isLoading, setIsLoading] = React.useState(true)

  if (!stackblitz) return null

  const codeFileNumber = stackblitz?.match(/\d/g)?.join('').substring(0, 2)
  const startCommand = `${exercise._type.substring(0, 1)}-${codeFileNumber}` // e.g. s-01, e-02, etc
  const githubOrg = 'total-typescript'
  const githubRepo = module.github.repo
  const clickToLoad = Number(false)
  const embedUrl = `https://stackblitz.com/github/${githubOrg}/${githubRepo}?file=${stackblitz}&embed=1&view=editor&hideExplorer=1&ctl=${clickToLoad}&terminal=${startCommand}`

  return (
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
