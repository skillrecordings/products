import React from 'react'
import {SanityDocument} from '@sanity/client'
import {track} from '../utils/analytics'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'
import {Exercise} from '../lib/exercises'

const ExerciseNavigator: React.FC<{
  module: SanityDocument
  section?: SanityDocument
  path: string
}> = ({module, section, path}) => {
  const router = useRouter()
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const activeElRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const activeElTop: any = activeElRef.current?.offsetTop
    const scrollContainerTop: any = scrollContainerRef.current?.offsetTop
    scrollContainerRef.current?.scrollTo({
      top: activeElTop - scrollContainerTop,
    })
  }, [router])

  const exercises = section ? section.exercises : module.exercises

  return (
    <div
      ref={scrollContainerRef}
      className="group relative h-[400px] overflow-y-auto pb-16 scrollbar-thin scrollbar-thumb-gray-800/70 hover:scrollbar-thumb-gray-700 lg:h-[calc(100vh-180px)]"
    >
      <nav aria-label="exercise navigator">
        <ul className="flex flex-col divide-y divide-gray-800/0 text-lg">
          {exercises?.map((exercise: Exercise, sectionIdx: number) => {
            //TODO treat this differently when a section is present as path will change
            const isActive =
              router.asPath ===
              `${path}/${module.slug.current}/${exercise.slug}`
            const scrollToElement =
              router.asPath ===
                `${path}/${module.slug.current}/${exercise.slug}/solution` ||
              router.asPath ===
                `${path}/${module.slug.current}/${exercise.slug}`

            return (
              <li key={exercise.slug} className="pt-2">
                {scrollToElement && (
                  <div ref={activeElRef} aria-hidden="true" />
                )}
                <Link
                  href={{
                    pathname: `${path}/[module]/[exercise]`,
                    query: {
                      module: module.slug.current,
                      exercise: exercise.slug,
                    },
                  }}
                  passHref
                >
                  <a
                    className="flex items-center px-4 py-2 font-semibold leading-tight hover:bg-gray-800"
                    onClick={() => {
                      track('clicked exercise in navigator', {
                        module: module.slug.current,
                        lesson: exercise.slug,
                        moduleType: module.moduleType,
                        lessonType: exercise._type,
                      })
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="pr-3 text-sm opacity-50"
                    >
                      {sectionIdx + 1}
                    </span>{' '}
                    {exercise.title}
                  </a>
                </Link>
                <ul className="text-gray-300">
                  <li key={exercise.slug + `exercise`}>
                    <Link
                      href={{
                        pathname: `${path}/[module]/[exercise]`,
                        query: {
                          module: module.slug.current,
                          exercise: exercise.slug,
                        },
                      }}
                      passHref
                    >
                      <a
                        className={cx(
                          'flex items-center border-l-4 py-2 px-8 text-base font-medium transition hover:bg-slate-400/20 hover:text-white',
                          {
                            'border-orange-400 bg-gray-800/80 text-white':
                              isActive,
                            'border-transparent ': !isActive,
                          },
                        )}
                        onClick={() => {
                          track(`clicked exercise in navigator`, {
                            module: module.slug.current,
                            lesson: exercise.slug,
                            location: router.query.lesson,
                            moduleType: module.moduleType,
                            lessonType: exercise._type,
                          })
                        }}
                      >
                        Problem
                      </a>
                    </Link>
                  </li>
                  <SolutionLink
                    module={module}
                    exercise={exercise}
                    path={path}
                  />
                </ul>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

const SolutionLink = ({
  module,
  exercise,
  path,
}: {
  module: SanityDocument
  exercise: Exercise
  path: string
}) => {
  const router = useRouter()
  const solution = exercise.solution
  const isActive =
    router.asPath ===
    `/tutorials/${module.slug.current}/${exercise.slug}/solution`
  return (
    <li key={solution?._key}>
      <Link
        href={{
          pathname: `${path}/[module]/[exercise]/solution`,
          query: {
            module: module.slug.current,
            exercise: exercise.slug,
          },
        }}
        passHref
      >
        <a
          className={cx(
            'flex items-center border-l-4 py-2 px-8 text-base font-medium transition hover:bg-slate-400/20 hover:text-white',
            {
              'border-cyan-400 bg-gray-800/80 text-white': isActive,
              'border-transparent ': !isActive,
            },
          )}
          onClick={() => {
            track(`clicked solution in navigator`, {
              module: module.slug.current,
              lesson: exercise.slug,
              moduleType: module.moduleType,
              lessonType: exercise._type,
            })
          }}
        >
          {capitalize(solution?._type)}
        </a>
      </Link>
    </li>
  )
}
export default ExerciseNavigator
