import * as React from 'react'
import {Exercise} from '.././lib/exercises'
import {SanityDocument} from '@sanity/client'
import {track} from '.././utils/analytics'
import {IconGithub} from './icons'

export const GitHubLink: React.FC<{
  exercise: Exercise
  module: SanityDocument
}> = ({exercise, module}) => {
  const {github} = module

  if (!github || !exercise.stackblitz) {
    return null
  }

  const openFile = exercise.stackblitz?.split(',')[0]

  return (
    <div className="pt-14">
      <h2 className="pb-4 text-2xl font-semibold sm:text-3xl">Código</h2>
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
          href={`https://github.com/escuela-frontend/${github.repo}/blob/main/${openFile}`}
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
