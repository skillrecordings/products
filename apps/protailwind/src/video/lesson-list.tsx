import React from 'react'
import {type SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'

import {type LessonResource} from '@skillrecordings/skill-lesson/schemas/lesson-resource'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'

type LessonTitleLinkProps = {
  path: string
  lesson: LessonResource
  section?: SanityDocument
  sectionIndex?: number
  module: SanityDocument
}

const LessonTitleLink: React.FC<LessonTitleLinkProps> = ({
  path,
  lesson,
  section,
  sectionIndex = 0,
  module,
}) => {
  return (
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
      className="relative flex items-center px-4 py-2 text-base font-semibold leading-tight hover:bg-gray-100"
      onClick={() => {
        track('clicked exercise in navigator', {
          module: module.slug.current,
          ...(section && {section: section.slug}),
          lesson: lesson.slug,
          moduleType: module.moduleType,
          lessonType: lesson._type,
        })
      }}
    >
      <span aria-hidden="true" className="absolute left-3 text-xs opacity-50">
        {sectionIndex + 1}
      </span>{' '}
      <span className="pl-5">{lesson.title}</span>
    </Link>
  )
}

export const LessonList: React.FC<{
  path: string
}> = ({path}) => {
  const router = useRouter()
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const {module, section} = useLesson()
  const activeElRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const activeElTop: any = activeElRef.current?.offsetTop
    const scrollContainerTop: any = scrollContainerRef.current?.offsetTop
    scrollContainerRef.current?.scrollTo({
      top: activeElTop - scrollContainerTop,
    })
  }, [router])

  const lessons = section ? section.lessons : module.lessons
  const hasSectionResources = section?.resources?.length > 0

  return (
    <div
      ref={scrollContainerRef}
      className="group relative h-[400px] overflow-y-auto pb-16 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 lg:h-[calc(100vh-128px)]"
    >
      <nav aria-label="exercise navigator" className="pb-3">
        <ul className="flex flex-col divide-y divide-gray-800/0 text-lg">
          {lessons?.map((exercise: LessonResource, sectionIdx: number) => {
            //TODO treat this differently when a section is present as path will change
            const currentPath = section
              ? `${path}/${module.slug.current}/${section.slug}/${exercise.slug}`
              : `${path}/${module.slug.current}/${exercise.slug}`
            const isActive = router.asPath === currentPath
            const scrollToElement =
              router.asPath === `${currentPath}/solution` ||
              router.asPath === currentPath

            return (
              <li key={exercise.slug} className="pt-2">
                {scrollToElement && (
                  <div ref={activeElRef} aria-hidden="true" />
                )}
                <LessonTitleLink
                  lesson={exercise}
                  section={section}
                  sectionIndex={sectionIdx}
                  module={module}
                  path={path}
                />
                {exercise._type === 'exercise' && (
                  <ul className="text-gray-700">
                    <li key={exercise.slug + `exercise`}>
                      <Link
                        href={{
                          pathname: section
                            ? `${path}/[module]/[section]/[lesson]`
                            : `${path}/[module]/[lesson]`,
                          query: {
                            module: module.slug.current,
                            lesson: exercise.slug,
                            ...(section && {section: section.slug}),
                          },
                        }}
                        passHref
                        className={cx(
                          'flex items-center border-l-4 py-2.5 px-8 text-sm font-medium transition',
                          {
                            'border-brand-red bg-white shadow-lg shadow-gray-300/20':
                              isActive,
                            'border-transparent hover:bg-gray-100': !isActive,
                          },
                        )}
                        onClick={() => {
                          track(`clicked exercise in navigator`, {
                            module: module.slug.current,
                            lesson: exercise.slug,
                            ...(section && {section: section.slug}),
                            location: router.query.lesson,
                            moduleType: module.moduleType,
                            lessonType: exercise._type,
                          })
                        }}
                      >
                        Exercise
                      </Link>
                    </li>
                    <SolutionLink
                      module={module}
                      exercise={exercise}
                      section={section}
                      path={path}
                    />
                  </ul>
                )}
                {exercise._type === 'explainer' && (
                  <ul className="text-gray-700">
                    <li key={exercise.slug + `exercise`}>
                      <Link
                        href={{
                          pathname: section
                            ? `${path}/[module]/[section]/[lesson]`
                            : `${path}/[module]/[lesson]`,
                          query: {
                            module: module.slug.current,
                            lesson: exercise.slug,
                            ...(section && {section: section.slug}),
                          },
                        }}
                        passHref
                        className={cx(
                          'flex items-center border-l-4 py-2.5 px-8 text-sm font-medium transition ',
                          {
                            'border-indigo-500 bg-white shadow-lg shadow-gray-300/20':
                              isActive,
                            'border-transparent hover:bg-gray-100': !isActive,
                          },
                        )}
                        onClick={() => {
                          track(`clicked explainer in navigator`, {
                            module: module.slug.current,
                            lesson: exercise.slug,
                            ...(section && {section: section.slug}),
                            location: router.query.lesson,
                            moduleType: module.moduleType,
                            lessonType: exercise._type,
                          })
                        }}
                      >
                        Explainer
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </nav>
      {hasSectionResources && (
        <nav
          aria-label="resource navigator"
          className="border-t border-gray-800 py-1"
        >
          <p className="px-5 pt-4 pb-2 text-xs font-medium uppercase tracking-wide text-gray-300">
            Section Resources
          </p>
          <ul className="flex flex-col divide-y divide-gray-800/0">
            {section?.resources?.map(
              (resource: SanityDocument, resourceIdx: number) => {
                return (
                  <li
                    key={resource.slug?.current || resource.slug}
                    className="pt-2"
                  >
                    <Link
                      href={resource.url}
                      passHref
                      className="flex items-center px-4 py-2 font-semibold leading-tight hover:bg-gray-800"
                      onClick={() => {
                        track('clicked link resource in navigator', {
                          module: module.slug.current,
                          ...(section && {section: section.slug}),
                          lesson: router.asPath.split('/').pop(),
                          moduleType: module.moduleType,
                          resource: resource.slug,
                        })
                      }}
                      target="_blank"
                    >
                      <span
                        aria-hidden="true"
                        className="pr-3 text-sm opacity-50"
                      >
                        ∙
                      </span>{' '}
                      {resource.title}
                    </Link>
                    <p className="pl-10 pr-3 text-sm text-gray-400">
                      {resource.description}
                    </p>
                  </li>
                )
              },
            )}
          </ul>
        </nav>
      )}
    </div>
  )
}

const SolutionLink = ({
  module,
  section,
  exercise,
  path,
}: {
  module: SanityDocument
  section?: SanityDocument
  exercise: LessonResource
  path: string
}) => {
  const router = useRouter()

  const currentPath = section
    ? `${path}/${module.slug.current}/${section.slug}/${exercise.slug}/solution`
    : `${path}/${module.slug.current}/${exercise.slug}/solution`
  const isActive = router.asPath === currentPath
  return (
    <li key={`${exercise.slug}-solution-link`}>
      <Link
        href={{
          pathname: section
            ? `${path}/[module]/[section]/[lesson]/solution`
            : `${path}/[module]/[lesson]/solution`,
          query: {
            module: module.slug.current,
            lesson: exercise.slug,
            ...(section && {section: section.slug}),
          },
        }}
        passHref
        className={cx(
          'flex items-center border-l-4 py-2.5 px-8 text-sm font-medium transition ',
          {
            'border-teal-500 bg-white shadow-lg shadow-gray-300/20': isActive,
            'border-transparent hover:bg-gray-100': !isActive,
          },
        )}
        onClick={() => {
          track(`clicked solution in navigator`, {
            module: module.slug.current,
            lesson: exercise.slug,
            moduleType: module.moduleType,
            lessonType: exercise._type,
            ...(section && {section: section.slug}),
          })
        }}
      >
        {capitalize('solution')}
      </Link>
    </li>
  )
}
