import React from 'react'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'
import {Lesson} from '../lib/lessons'

const LessonNavigator: React.FC<{
  module: SanityDocument
  path: string
}> = ({module, path}) => {
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

  return (
    <div
      ref={scrollContainerRef}
      className="group relative h-[400px] overflow-y-auto pb-16 scrollbar-thin scrollbar-thumb-gray-800/70 hover:scrollbar-thumb-gray-700 lg:h-[calc(100vh-180px)]"
    >
      <nav aria-label="exercise navigator">
        <ul className="flex flex-col divide-y divide-gray-800/0 text-lg">
          {module.lessons.map((lesson: Lesson, sectionIdx: number) => {
            const isActive =
              router.asPath === `/aprende/${module.slug.current}/${lesson.slug}`
            const scrollToElement =
              router.asPath ===
                `/aprende/${module.slug.current}/${lesson.slug}/solution` ||
              router.asPath === `/aprende/${module.slug.current}/${lesson.slug}`

            return (
              <li key={lesson.slug} className="pt-2">
                {scrollToElement && (
                  <div ref={activeElRef} aria-hidden="true" />
                )}
                <Link
                  href={{
                    pathname: `${path}/[module]/[lesson]`,
                    query: {
                      module: module.slug.current,
                      lesson: lesson.slug,
                    },
                  }}
                  passHref
                >
                  <a className="flex items-center px-4 py-2 font-semibold leading-tight hover:bg-gray-900 text-white">
                    <span
                      aria-hidden="true"
                      className="pr-3 text-sm opacity-50"
                    >
                      {sectionIdx + 1}
                    </span>{' '}
                    {lesson.title}
                  </a>
                </Link>
                <ul className="text-gray-300">
                  <li key={lesson.slug + `lesson`}>
                    <Link
                      href={{
                        pathname: `${path}/[module]/[lesson]`,
                        query: {
                          module: module.slug.current,
                          lesson: lesson.slug,
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
                      >
                        Problem
                      </a>
                    </Link>
                  </li>
                  <SolutionLink module={module} lesson={lesson} path={path} />
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
  lesson,
  path,
}: {
  module: SanityDocument
  lesson: Lesson
  path: string
}) => {
  const router = useRouter()
  const solution = lesson.solution
  const isActive =
    router.asPath === `/aprende/${module.slug.current}/${lesson.slug}/solution`

  return (
    <li key={solution?._key}>
      <Link
        href={{
          pathname: `${path}/[module]/[lesson]/solution`,
          query: {
            module: module.slug.current,
            lesson: lesson.slug,
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
        >
          {capitalize(solution?._type)}
        </a>
      </Link>
    </li>
  )
}
export default LessonNavigator
