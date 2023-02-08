import React from 'react'
import {type SanityDocument} from '@sanity/client'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'

import {type Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {trpc} from '../trpc/trpc.client'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import Icon from 'components/icons'

type LessonTitleLinkProps = {
  path: string
  lesson: Lesson
  section?: Section
  sectionIndex?: number
  module: Module
  currentPath: string
}

const LessonTitleLink: React.FC<LessonTitleLinkProps> = ({
  path,
  lesson,
  section,
  sectionIndex = 0,
  module,
  currentPath,
}) => {
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })
  const router = useRouter()
  const isLessonCompleted = moduleProgress?.lessons.find(
    (progressLesson) =>
      progressLesson.id === lesson._id && progressLesson.lessonCompleted,
  )

  const isExpanded = !isLessonCompleted || router.asPath.includes(currentPath)

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
      className={cx(
        'relative flex items-center px-4 py-2 text-base font-semibold leading-tight hover:bg-gray-100',
        {
          'text-gray-700 opacity-80 transition hover:text-gray-900 hover:opacity-100':
            isLessonCompleted && !isExpanded,
        },
      )}
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
      {isLessonCompleted ? (
        <Icon
          name="Checkmark"
          aria-hidden="true"
          className="absolute left-3 w-3 text-xs text-emerald-500"
        />
      ) : (
        <span aria-hidden="true" className="absolute left-3 text-xs opacity-50">
          {sectionIndex + 1}
        </span>
      )}{' '}
      <span className="pl-5">
        {lesson.title}{' '}
        {isLessonCompleted && <span className="sr-only">(completed)</span>}
      </span>
    </Link>
  )
}

const ExerciseListItem = ({
  path,
  currentPath,
  exercise,
}: {
  path: string
  currentPath: string
  exercise: Lesson
}) => {
  const router = useRouter()
  const {module, section} = useLesson()

  const {data: moduleProgress} = trpc.moduleProgress.bySlug.useQuery({
    slug: module.slug.current,
  })
  const completedLessons = moduleProgress?.lessons.filter(
    (l) => l.lessonCompleted,
  )
  const isLessonCompleted = completedLessons?.find(
    ({id}) => id === exercise?._id,
  )

  const isActive =
    router.asPath === currentPath || router.asPath === currentPath + '/exercise'

  const isExpanded = !isLessonCompleted || router.asPath.includes(currentPath)

  return isExpanded ? (
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
  ) : null
}

export const LessonList: React.FC<{
  path: string
}> = ({path}) => {
  const router = useRouter()
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const {module, section, lesson} = useLesson()
  const activeElRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const activeElTop: any = activeElRef.current?.offsetTop
    const scrollContainerTop: any = scrollContainerRef.current?.offsetTop
    scrollContainerRef.current?.scrollTo({
      top: activeElTop - 0,
    })
  }, [router])

  const lessons = section ? section.lessons : module.lessons
  const hasSectionResources =
    section?.resources && section?.resources.length > 0
  return (
    <div
      ref={scrollContainerRef}
      className="group relative h-[400px] overflow-y-auto pb-16 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 lg:h-[calc(100vh-128px)]"
    >
      <nav aria-label="exercise navigator" className="pb-3">
        <ul className="flex flex-col divide-y divide-gray-800/0 text-lg text-gray-700">
          {lessons?.map((exercise: Lesson, sectionIdx: number) => {
            //TODO treat this differently when a section is present as path will change
            const currentPath = section
              ? `${path}/${module.slug.current}/${section.slug}/${exercise.slug}`
              : `${path}/${module.slug.current}/${exercise.slug}`

            const scrollToElement =
              router.asPath === `${currentPath}/solution` ||
              router.asPath === currentPath

            return (
              <li key={exercise.slug} className="pt-2">
                {scrollToElement && (
                  <div ref={activeElRef} aria-hidden="true" />
                )}
                <LessonTitleLink
                  currentPath={currentPath}
                  lesson={exercise}
                  section={section}
                  sectionIndex={sectionIdx}
                  module={module}
                  path={path}
                />
                {exercise._type === 'exercise' && (
                  <ExerciseListItem
                    exercise={exercise}
                    currentPath={currentPath}
                    path={path}
                  />
                )}
                {exercise._type === 'explainer' && (
                  <ExplainerLink
                    exercise={exercise}
                    currentPath={currentPath}
                    path={path}
                  />
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
            {section?.resources?.map((resource: any, resourceIdx: number) => {
              // resources can have a lot of shapes here so the type gets weird
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
            })}
          </ul>
        </nav>
      )}
    </div>
  )
}

const ExplainerLink = ({
  exercise,
  path,
  currentPath,
}: {
  exercise: Lesson
  path: string
  currentPath: string
}) => {
  const {module, section} = useLesson()
  const router = useRouter()
  const isActive = router.asPath === currentPath

  const {data: moduleProgress} = trpc.moduleProgress.bySlug.useQuery({
    slug: module.slug.current,
  })
  const completedLessons = moduleProgress?.lessons.filter(
    (l) => l.lessonCompleted,
  )
  const isLessonCompleted = completedLessons?.find(
    ({id}) => id === exercise?._id,
  )

  const isExpanded = !isLessonCompleted || router.asPath.includes(currentPath)

  return isExpanded ? (
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
          'border-indigo-500 bg-white shadow-lg shadow-gray-300/20': isActive,
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
  ) : null
}

const SolutionLink = ({
  module,
  section,
  exercise,
  path,
}: {
  module: Module
  section?: Section
  exercise: Lesson
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
