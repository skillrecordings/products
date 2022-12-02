import React from 'react'
import {SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'
import {Lesson} from '../../lib/lesson'

const LessonNavigator: React.FC<{
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

  const lessons = section ? section.lessons : module.lessons

  return (
    <div
      ref={scrollContainerRef}
      className="group relative h-[400px] overflow-y-auto pb-16 scrollbar-thin scrollbar-thumb-gray-300/70 hover:scrollbar-thumb-gray-300 lg:h-[calc(100vh-140px)]"
    >
      <nav aria-label="lesson navigator">
        <ul className="flex flex-col divide-y divide-gray-800/0 text-base">
          {lessons?.map((lesson: Lesson, sectionIdx: number) => {
            //TODO treat this differently when a section is present as path will change
            const currentPath = section
              ? `${path}/${module.slug.current}/${section.slug}/${lesson.slug}`
              : `${path}/${module.slug.current}/${lesson.slug}`
            const isActive = router.asPath === currentPath

            return (
              <li key={lesson.slug} className="pt-2">
                <Link
                  href={{
                    pathname: section
                      ? `${path}/[module]/[section]/[lesson]`
                      : `${path}/[module]/[lesson]`,
                    query: {
                      module: module.slug.current,
                      lesson: lesson.slug,
                      ...(section && {section: section.slug}),
                    },
                  }}
                  passHref
                >
                  <a
                    className={cx(
                      'flex items-center px-4 py-2 font-semibold leading-tight ',
                      {
                        ' shadow-xl shadow-gray-500/5': isActive && !lesson,
                        '': !isActive && !lesson,
                      },
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="pr-3 text-sm opacity-50"
                    >
                      {sectionIdx + 1}
                    </span>{' '}
                    {lesson.title}
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export default LessonNavigator
