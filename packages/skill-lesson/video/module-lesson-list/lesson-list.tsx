import * as React from 'react'
import {type Section} from '../../schemas/section'
import {type Module} from '../../schemas/module'
import {type Lesson} from '../../schemas/lesson'
import {useLesson} from '../../hooks/use-lesson'
import {CheckIcon, ChevronDownIcon, LinkIcon} from '@heroicons/react/solid'
import {track} from '../../utils/analytics'
import {useModuleProgress} from '../../video/module-progress'
import * as Accordion from '@radix-ui/react-accordion'
import capitalize from 'lodash/capitalize'
import Balancer from 'react-wrap-balancer'
import {useRouter} from 'next/router'
import Link from 'next/link'

export const LessonList: React.FC<{
  lessonResourceRenderer: (
    path: string,
    module: Module,
    lesson: Lesson,
    section?: Section,
  ) => void
  path: string
}> = ({path, lessonResourceRenderer}) => {
  const router = useRouter()
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const {module, section: currentSection} = useLesson()
  const activeElRef = React.useRef<HTMLDivElement>(null)
  const sections = module.sections
  const lessons = currentSection ? currentSection.lessons : module.lessons
  const hasSectionResources =
    currentSection?.resources && currentSection?.resources?.length > 0

  const [openedSection, setOpenedSection] = React.useState<string>(
    currentSection ? currentSection.slug : '',
  )

  React.useEffect(() => {
    currentSection && setOpenedSection(currentSection.slug)
  }, [currentSection])

  React.useEffect(() => {
    const activeElementOffset = activeElRef.current?.offsetTop

    activeElementOffset &&
      scrollContainerRef.current?.scrollTo({
        top:
          activeElementOffset -
          (module.sections && module.sections.length > 1 ? 48 : 0),
      })
  }, [router, activeElRef, scrollContainerRef, module, openedSection])

  const handleOnAccordionValueChange = (sectionSlug: string) => {
    setOpenedSection(sectionSlug)
    // navigate to lesson in current section
    // if (sectionSlug !== openedSection && sections) {
    //   const section = sections.find((section) => section.slug === sectionSlug)
    // Note: scrolling below first lesson results in jumpy ui
    // const sectionProgress = moduleProgress?.sections?.find(
    //   (s) => s.id === section?._id,
    // )
    // const nextLesson = sectionProgress?.lessons.find(
    //   ({lessonCompleted}) => !lessonCompleted,
    // )

    // if (nextLesson) {
    //   router.push({
    //     query: {
    //       lesson: nextLesson.slug,
    //       section: sectionSlug,
    //       module: module.slug.current,
    //     },
    //     pathname: `${path}/[module]/[section]/[lesson]`,
    //   })
    // } else {
    // const firstLesson = section?.lessons && section.lessons[0]
    // firstLesson &&
    //   router.push({
    //     query: {
    //       lesson: firstLesson.slug,
    //       section: sectionSlug,
    //       module: module.slug.current,
    //     },
    //     pathname: `${path}/[module]/[section]/[lesson]`,
    //   })
    // }
    // }
  }

  return (
    <div ref={scrollContainerRef} data-module-lesson-list="">
      <nav aria-label="lesson list">
        {sections ? (
          <>
            {sections.length > 1 ? (
              <Accordion.Root
                type="single"
                collapsible
                onValueChange={handleOnAccordionValueChange}
                defaultValue={openedSection}
                value={openedSection}
              >
                <ul data-sections="">
                  {sections.map((section) => {
                    if (!section.lessons?.length) {
                      return null
                    }

                    return (
                      <Section
                        lessonResourceRenderer={lessonResourceRenderer}
                        path={path}
                        section={section}
                        key={section._id}
                        openedSection={openedSection}
                        currentSection={currentSection}
                        module={module}
                        ref={activeElRef}
                      />
                    )
                  })}
                </ul>
              </Accordion.Root>
            ) : (
              <ul data-single-section="">
                {sections[0].lessons?.map((lesson: Lesson, index: number) => {
                  return (
                    <Lesson
                      lessonResourceRenderer={lessonResourceRenderer}
                      section={sections ? sections[0] : undefined}
                      lesson={lesson}
                      module={module}
                      path={path}
                      ref={activeElRef}
                      index={index}
                      key={lesson._id}
                    />
                  )
                })}
                {hasSectionResources && (
                  <SectionResources section={currentSection} module={module} />
                )}
              </ul>
            )}
          </>
        ) : (
          <ul data-single-section="">
            {lessons?.map((lesson: Lesson, index: number) => {
              return (
                <Lesson
                  lessonResourceRenderer={lessonResourceRenderer}
                  section={sections ? sections[0] : undefined}
                  lesson={lesson}
                  module={module}
                  path={path}
                  ref={activeElRef}
                  index={index}
                  key={lesson._id}
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

const Section = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    lessonResourceRenderer: (
      path: string,
      module: Module,
      lesson: Lesson,
      section?: Section,
    ) => void
    path: string
    section: Section
    openedSection: string
    currentSection: Section | undefined
    module: Module
  }>
>(
  (
    {
      lessonResourceRenderer,
      path,
      module,
      section,
      openedSection,
      currentSection,
    },
    activeElRef,
  ) => {
    const moduleProgress = useModuleProgress()
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
      <li>
        <Accordion.Item value={section.slug}>
          <Accordion.Header data-accordion-header="">
            <Accordion.Trigger data-accordion-trigger="">
              <Balancer>{section.title}</Balancer>
              <div data-icons="">
                {isSectionCompleted && (
                  <CheckIcon data-check-icon="" aria-hidden="true" />
                )}
                {isCurrentSection && <span data-active-section-indicator="" />}
                <ChevronDownIcon data-chevron-down-icon="" aria-hidden="true" />
              </div>
            </Accordion.Trigger>
            <div
              aria-hidden="true"
              data-section-progress={`${sectionPercentComplete}%`}
              style={{width: `${sectionPercentComplete}%`}}
            />
          </Accordion.Header>
          <Accordion.Content data-accordion-content="">
            <ul>
              {section.lessons?.map((lesson: Lesson, index: number) => {
                return (
                  <>
                    {index === 0 && isSectionOpened && (
                      <div
                        ref={activeElRef}
                        key={lesson._id + '-active'}
                        aria-hidden="true"
                      />
                    )}
                    <Lesson
                      lessonResourceRenderer={lessonResourceRenderer}
                      isCurrentSection={isCurrentSection}
                      key={lesson._id}
                      lesson={lesson}
                      module={module}
                      section={section}
                      index={index}
                      path={path}
                      ref={activeElRef}
                    />
                  </>
                )
              })}
            </ul>
            {hasSectionResources && (
              <SectionResources section={section} module={module} />
            )}
          </Accordion.Content>
        </Accordion.Item>
      </li>
    )
  },
)

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
      data-lesson-title=""
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
        <CheckIcon data-check-icon="" aria-hidden="true" />
      ) : (
        <span aria-hidden="true" data-index={index + 1}>
          {index + 1}
        </span>
      )}{' '}
      <Balancer>{lesson.title}</Balancer>{' '}
      {isLessonCompleted && <span className="sr-only">(completed)</span>}
    </Link>
  )
}

const Lesson = React.forwardRef<
  HTMLDivElement,
  {
    section?: Section
    index?: number
    path: string
    lesson: Lesson
    module: Module
    isCurrentSection?: boolean
    lessonResourceRenderer: (
      path: string,
      module: Module,
      lesson: Lesson,
      section?: Section,
    ) => void
  }
>(
  (
    {
      section,
      path,
      lesson,
      module,
      index,
      isCurrentSection,
      lessonResourceRenderer,
    },
    ref,
  ) => {
    const moduleProgress = useModuleProgress()
    const completedLessons = moduleProgress?.lessons.filter(
      (l) => l.lessonCompleted,
    )
    const isLessonCompleted = completedLessons?.find(
      ({id}) => id === lesson._id,
    )
    const router = useRouter()
    const currentPath = section
      ? `${path}/${module.slug.current}/${section.slug}/${lesson.slug}`
      : `${path}/${module.slug.current}/${lesson.slug}`

    const isExpanded = router.asPath.includes(currentPath)

    const scrollToElement = section
      ? router.asPath.includes(currentPath) && isCurrentSection
      : router.asPath.includes(currentPath)

    return (
      <li
        data-lesson=""
        data-type={lesson._type}
        data-is-lesson-completed={isLessonCompleted}
        data-is-expanded={isExpanded}
      >
        {scrollToElement && <div ref={ref} aria-hidden="true" />}
        <LessonTitleLink
          lesson={lesson}
          section={section}
          index={index}
          module={module}
          path={path}
        />
        {isExpanded && (
          <ul>
            <>{lessonResourceRenderer(path, module, lesson, section)}</>
          </ul>
        )}
      </li>
    )
  },
)

export const ExplainerLink = ({
  lesson,
  module,
  section,
  path,
}: {
  lesson: Lesson
  module: Module
  section?: Section
  path: string
}) => {
  const router = useRouter()
  const currentPath = section
    ? `${path}/${module.slug.current}/${section.slug}/${lesson.slug}`
    : `${path}/${module.slug.current}/${lesson.slug}`
  const isActive = router.asPath === currentPath

  return (
    <li key={lesson.slug + `explainer`} data-explainer="">
      <Link
        data-is-active={isActive}
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
        onClick={() => {
          track(`clicked explainer in navigator`, {
            module: module.slug.current,
            lesson: lesson.slug,
            ...(section && {section: section.slug}),
            location: router.query.lesson,
            moduleType: module.moduleType,
            lessonType: lesson._type,
          })
        }}
      >
        Explainer
      </Link>
    </li>
  )
}

export const ProblemLink = ({
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
    <li key={exercise.slug + `exercise`} data-problem="">
      <Link
        data-is-active={isActive}
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

export const ExerciseLink = ({
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

  const currentPath = section
    ? `${path}/${module.slug.current}/${section.slug}/${lesson.slug}`
    : `${path}/${module.slug.current}/${lesson.slug}`
  const isActive = router.asPath === currentPath + '/exercise'

  return (
    <li data-exercise="">
      <Link
        data-is-active={isActive}
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
        passHref
      >
        Exercise
      </Link>
    </li>
  )
}

export const SolutionLink = ({
  module,
  section,
  lesson,
  path,
}: {
  module: Module
  section?: Section
  lesson: Lesson
  path: string
}) => {
  const router = useRouter()
  const currentPath = section
    ? `${path}/${module.slug.current}/${section.slug}/${lesson.slug}/solution`
    : `${path}/${module.slug.current}/${lesson.slug}/solution`
  const isActive = router.asPath === currentPath

  return (
    <li key={`${lesson.slug}-solution-link`} data-solution="">
      <Link
        data-is-active={isActive}
        href={{
          pathname: section
            ? `${path}/[module]/[section]/[lesson]/solution`
            : `${path}/[module]/[lesson]/solution`,
          query: {
            module: module.slug.current,
            lesson: lesson.slug,
            ...(section && {section: section.slug}),
          },
        }}
        passHref
        onClick={() => {
          track(`clicked solution in navigator`, {
            module: module.slug.current,
            lesson: lesson.slug,
            moduleType: module.moduleType,
            lessonType: lesson._type,
            ...(section && {section: section.slug}),
          })
        }}
      >
        {capitalize('solution')}
      </Link>
    </li>
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
    <nav aria-label="resource navigator" data-section-resources="">
      <p data-label="">Section Resources</p>
      <ul>
        {section?.resources?.map((resource: any) => {
          // this uses any because the resource type here expects a URL, but that
          // assumes a specific resource type. We need to support any resource type
          // and present it based on it's structure that doesn't assume a resource
          // is simply a URL
          return (
            <li key={resource.url}>
              <Link
                href={resource.url}
                passHref
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
                <LinkIcon aria-hidden="true" />
                {resource.title}
              </Link>
              <p>{resource.description}</p>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
