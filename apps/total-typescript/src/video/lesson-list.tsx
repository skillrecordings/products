import React from 'react'
import {useRouter} from 'next/router'
import capitalize from 'lodash/capitalize'
import Link from 'next/link'
import cx from 'classnames'
import * as Accordion from '@radix-ui/react-accordion'
import {type Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {trpc} from 'trpc/trpc.client'
import {CheckIcon, ChevronDownIcon, LinkIcon} from '@heroicons/react/solid'
import Balancer from 'react-wrap-balancer'
import {useModuleProgress} from './module-progress'

type LessonTitleLinkProps = {
  path: string
  lesson: Lesson
  section?: Section
  index?: number
  module: Module
}

const LessonTitleLink: React.FC<LessonTitleLinkProps> = ({
  path,
  lesson,
  section,
  index = 0,
  module,
}) => {
  const moduleProgress = useModuleProgress()

  const isLessonCompleted = moduleProgress?.lessons.find(
    (progressLesson) =>
      progressLesson.id === lesson._id && progressLesson.lessonCompleted,
  )

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
      className="flex items-center px-4 py-2.5 font-semibold leading-tight hover:bg-gray-800/50"
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
        <CheckIcon
          className="mr-[7.5px] -ml-1 h-4 w-4 flex-shrink-0 text-cyan-400"
          aria-hidden="true"
        />
      ) : (
        <span aria-hidden="true" className="pr-3 text-sm opacity-50">
          {index + 1}
        </span>
      )}{' '}
      <Balancer>{lesson.title}</Balancer>{' '}
      {isLessonCompleted && <span className="sr-only">(completed)</span>}
    </Link>
  )
}

export const LessonList: React.FC<{
  path: string
}> = ({path}) => {
  const router = useRouter()
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const {module, section: currentSection} = useLesson()
  const activeElRef = React.useRef<HTMLDivElement>(null)
  const sections = module.sections
  const lessons = currentSection ? currentSection.lessons : module.lessons
  const moduleProgress = useModuleProgress()

  const hasSectionResources =
    currentSection?.resources && currentSection?.resources?.length > 0

  const [openedSection, setOpenedSection] = React.useState<string>(
    currentSection ? currentSection.slug : '',
  )

  React.useEffect(() => {
    currentSection && setOpenedSection(currentSection.slug)
  }, [currentSection])

  React.useEffect(() => {
    const activeElementOffset = moduleProgress && activeElRef.current?.offsetTop

    activeElementOffset &&
      scrollContainerRef.current?.scrollTo({
        top:
          activeElementOffset -
          (module.sections && module.sections.length > 1 ? 48 : 0),
      })
  }, [
    router,
    activeElRef,
    scrollContainerRef,
    module,
    moduleProgress,
    openedSection,
  ])

  const handleOnAccordionValueChange = (sectionSlug: string) => {
    setOpenedSection(sectionSlug)
    // navigate to lesson in current section
    if (sectionSlug !== openedSection && sections) {
      const section = sections.find((section) => section.slug === sectionSlug)
      const sectionProgress = moduleProgress?.sections?.find(
        (s) => s.id === section?._id,
      )
      const nextLesson = sectionProgress?.lessons.find(
        ({lessonCompleted}) => !lessonCompleted,
      )

      if (nextLesson) {
        router.push({
          query: {
            lesson: nextLesson.slug,
            section: sectionSlug,
            module: module.slug.current,
          },
          pathname: `${path}/[module]/[section]/[lesson]`,
        })
      } else {
        const firstLesson = section?.lessons && section.lessons[0]
        firstLesson &&
          router.push({
            query: {
              lesson: firstLesson.slug,
              section: sectionSlug,
              module: module.slug.current,
            },
            pathname: `${path}/[module]/[section]/[lesson]`,
          })
      }
    }
  }

  return (
    <div
      ref={scrollContainerRef}
      className="group relative h-[400px] overflow-y-auto pb-16 scrollbar-thin scrollbar-thumb-gray-800/70 hover:scrollbar-thumb-gray-700 lg:h-[calc(100vh-180px)]"
    >
      <nav aria-label="exercise navigator">
        {sections ? (
          <Accordion.Root
            type="single"
            collapsible
            onValueChange={handleOnAccordionValueChange}
            defaultValue={openedSection}
          >
            <ul className="relative">
              {sections.map((section) => {
                const sectionProgress = moduleProgress?.sections?.find(
                  (s) => s.id === section._id,
                )
                const isSectionCompleted = sectionProgress?.sectionCompleted
                const sectionPercentComplete = sectionProgress?.percentComplete
                const isCurrentSection = section.slug === currentSection?.slug
                const isSectionOpened = openedSection === section.slug

                const hasSectionResources =
                  section?.resources && section?.resources?.length > 0

                return (
                  <li key={section.slug}>
                    <Accordion.Item value={section.slug}>
                      <Accordion.Header className="sticky top-0 z-10 overflow-hidden bg-gray-900 shadow-xl shadow-black/20">
                        <Accordion.Trigger
                          className={cx(
                            'group relative z-10 flex w-full items-center justify-between border-b border-white/5 bg-gray-800/20 py-3 pl-3 pr-4 text-left text-lg font-semibold leading-tight transition hover:bg-gray-800/40',
                          )}
                        >
                          <Balancer>{section.title}</Balancer>
                          <div className="flex items-center">
                            {isSectionCompleted && (
                              <CheckIcon
                                className="mr-2 h-4 w-4 text-teal-400"
                                aria-hidden="true"
                              />
                            )}
                            {isCurrentSection && (
                              <span className="mr-3 h-1 w-1 animate-pulse rounded-full bg-cyan-500 opacity-75 duration-1000" />
                            )}
                            <ChevronDownIcon
                              className={cx(
                                'relative h-3 w-3 transition group-hover:opacity-100 group-radix-state-open:rotate-180',
                                {
                                  'opacity-80': isSectionOpened,
                                  'opacity-50': !isSectionOpened,
                                },
                              )}
                              aria-hidden="true"
                            />
                          </div>
                        </Accordion.Trigger>
                        <div
                          aria-hidden="true"
                          className={`absolute left-0 top-0 h-full bg-white/5`}
                          style={{width: `${sectionPercentComplete}%`}}
                        />
                      </Accordion.Header>
                      <Accordion.Content>
                        <ul className="flex flex-col divide-y divide-gray-800/0 border-b border-white/5 text-lg">
                          {section.lessons?.map(
                            (exercise: Lesson, index: number) => {
                              return (
                                <>
                                  {index === 0 && isSectionOpened && (
                                    <div
                                      ref={activeElRef}
                                      className="w-0"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <Lessons
                                    isCurrentSection={isCurrentSection}
                                    key={exercise._id}
                                    exercise={exercise}
                                    module={module}
                                    section={section}
                                    index={index}
                                    path={path}
                                    ref={activeElRef}
                                  />
                                </>
                              )
                            },
                          )}
                        </ul>
                        {hasSectionResources && (
                          <SectionResources section={section} module={module} />
                        )}
                      </Accordion.Content>
                    </Accordion.Item>
                  </li>
                )
              })}
            </ul>
          </Accordion.Root>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-800/0 text-lg">
            {lessons?.map((exercise: Lesson, index: number) => {
              return (
                <Lessons
                  exercise={exercise}
                  module={module}
                  path={path}
                  ref={activeElRef}
                  index={index}
                  key={exercise._id}
                />
              )
            })}
            {hasSectionResources && (
              <SectionResources section={currentSection} module={module} />
            )}
          </ul>
        )}
      </nav>
    </div>
  )
}

const SectionResources = ({
  section,
  module,
}: {
  section: Section
  module: Module
}) => {
  const router = useRouter()

  return (
    <nav aria-label="resource navigator" className="bg-black/30 pt-1 pb-8">
      <p className="px-5 pt-4 pb-2 text-xs font-medium uppercase tracking-wide text-gray-300">
        Section Resources
      </p>
      <ul className="flex flex-col divide-y divide-gray-800/0 text-lg">
        {section?.resources?.map((resource: any) => {
          // this uses any because the resource type here expects a URL, but that
          // assumes a specific resource type. We need to support any resource type
          // and present it based on it's structure that doesn't assume a resource
          // is simply a URL
          return (
            <li key={resource.url} className="pt-2">
              <Link
                href={resource.url}
                passHref
                className="flex items-center px-4 py-2 font-semibold leading-tight hover:bg-gray-800/40"
                onClick={() => {
                  track('clicked link resource in navigator', {
                    module: module.slug.current,
                    ...(section && {
                      section: section.slug,
                    }),
                    lesson: router.asPath.split('/').pop(),
                    moduleType: module.moduleType,
                    resource: resource.slug,
                  })
                }}
                target="_blank"
              >
                <LinkIcon
                  className="mr-3 h-3 w-3 flex-shrink-0 text-gray-500"
                  aria-hidden="true"
                />
                {resource.title}
              </Link>
              <p className="pl-10 pr-3 text-sm italic text-gray-400">
                {resource.description}
              </p>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

const Lessons = React.forwardRef<
  HTMLDivElement,
  {
    section?: Section
    index?: number
    path: string
    exercise: Lesson
    module: Module
    isCurrentSection?: boolean
  }
>(({section, path, exercise, module, index, isCurrentSection}, ref) => {
  const moduleProgress = useModuleProgress()
  const completedLessons = moduleProgress?.lessons.filter(
    (l) => l.lessonCompleted,
  )
  const isLessonCompleted = completedLessons?.find(
    ({id}) => id === exercise._id,
  )
  const router = useRouter()
  const currentPath = section
    ? `${path}/${module.slug.current}/${section.slug}/${exercise.slug}`
    : `${path}/${module.slug.current}/${exercise.slug}`

  const isExpanded = router.asPath.includes(currentPath)

  const scrollToElement = section
    ? router.asPath.includes(currentPath) && isCurrentSection
    : router.asPath.includes(currentPath)

  return (
    <li
      key={exercise._id}
      className={cx('', {
        'text-gray-300 opacity-80 hover:text-gray-100 hover:opacity-100':
          isLessonCompleted && !isExpanded,
        'text-gray-300 opacity-90 hover:text-gray-100 hover:opacity-100':
          !isExpanded,
        'bg-gray-700/20': isExpanded,
      })}
    >
      {scrollToElement && <div ref={ref} aria-hidden="true" />}
      <LessonTitleLink
        lesson={exercise}
        section={section}
        index={index}
        module={module}
        path={path}
      />
      {isExpanded && (
        <ul className="text-gray-300">
          {exercise._type === 'exercise' && (
            <>
              <ProblemLink
                module={module}
                exercise={exercise}
                section={section}
                path={path}
              />
              <StackblitzLink
                module={module}
                lesson={exercise}
                section={section}
                path={path}
              />
              <SolutionLink
                module={module}
                exercise={exercise}
                section={section}
                path={path}
              />
            </>
          )}
          {exercise._type === 'explainer' && (
            <ExplainerLink
              exercise={exercise}
              module={module}
              section={section}
              path={path}
            />
          )}
        </ul>
      )}
    </li>
  )
})

const ExplainerLink = ({
  exercise,
  module,
  section,
  path,
}: {
  exercise: Lesson
  module: Module
  section?: Section
  path: string
}) => {
  const router = useRouter()
  const currentPath = section
    ? `${path}/${module.slug.current}/${section.slug}/${exercise.slug}`
    : `${path}/${module.slug.current}/${exercise.slug}`
  const isActive = router.asPath === currentPath

  return (
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
          'flex items-center border-l-4 py-2 px-8 text-base font-medium transition hover:bg-gray-800/50 hover:text-white',
          {
            'border-indigo-400 bg-gray-800/80 text-white': isActive,
            'border-transparent ': !isActive,
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
  )
}

const ProblemLink = ({
  exercise,
  path,
  section,
  module,
}: {
  exercise: Lesson
  path: string
  section?: Section
  module: Module
}) => {
  const router = useRouter()
  const currentPath = section
    ? `${path}/${module.slug.current}/${section.slug}/${exercise.slug}`
    : `${path}/${module.slug.current}/${exercise.slug}`
  const isActive = router.asPath === currentPath
  return (
    <li key={exercise.slug + `exercise`} className="relative flex items-center">
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
          'flex w-full items-center border-l-4 py-2 px-8 text-base font-medium transition hover:bg-gray-800/50 hover:text-white',
          {
            'border-orange-400 bg-gray-800/80 text-white': isActive,
            'border-transparent ': !isActive,
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
        Problem
      </Link>
    </li>
  )
}

const StackblitzLink = ({
  module,
  lesson,
  section,
  path,
}: {
  module: Module
  section?: Section
  lesson: Lesson
  path: string
}) => {
  const router = useRouter()
  const {data: stackblitz, status: stackblitzStatus} =
    trpc.stackblitz.byExerciseSlug.useQuery({
      slug: router.query.lesson as string,
      type: lesson._type,
    })
  const currentPath = section
    ? `${path}/${module.slug.current}/${section.slug}/${lesson.slug}`
    : `${path}/${module.slug.current}/${lesson.slug}`
  const isActive = router.asPath === currentPath + '/exercise'

  return (
    <>
      {stackblitzStatus === 'loading' ? (
        <li
          className={cx(
            'flex w-full items-center border-l-4 border-transparent py-2 px-8 text-base font-medium',
          )}
        >
          Exercise
        </li>
      ) : stackblitz ? (
        <li>
          <Link
            href={{
              pathname: section
                ? `${path}/[module]/[section]/[lesson]/exercise`
                : `${path}/[module]/[lesson]/exercise`,
              query: {
                module: module.slug.current,
                lesson: lesson.slug,
                ...(section && {section: section.slug}),
              },
            }}
            className={cx(
              'flex w-full items-center border-l-4 py-2 px-8 text-base font-medium transition hover:bg-gray-800/50 hover:text-white',
              {
                'border-indigo-400 bg-gray-800/80 text-white': isActive,
                'border-transparent ': !isActive,
              },
            )}
          >
            Exercise
          </Link>
        </li>
      ) : null}
    </>
  )
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
          'flex items-center border-l-4 py-2 px-8 text-base font-medium transition hover:bg-gray-800/50 hover:text-white',
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
            ...(section && {section: section.slug}),
          })
        }}
      >
        {capitalize('solution')}
      </Link>
    </li>
  )
}
