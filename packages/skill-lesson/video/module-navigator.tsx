import {capitalize, first, isEmpty} from 'lodash'
import {type Module} from '../schemas/module'
import {trpcSkillLessons} from '../utils/trpc-skill-lessons'
import Balancer from 'react-wrap-balancer'
import React from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import {type Section} from '../schemas/section'
import {type Lesson} from '../schemas/lesson'
import {useModuleProgress} from './module-progress'
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronDownIcon,
  LockClosedIcon,
} from '@heroicons/react/solid'
import {createAppAbility} from '../utils/ability'
import Link from 'next/link'
import pluralize from 'pluralize'
import {track} from '../utils/analytics'

const ModuleNavigator: React.FC<{
  module: Module
}> = ({module}) => {
  const {sections, moduleType, lessons} = module
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpcSkillLessons.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })
  const nextSection = moduleProgress?.nextSection
  const initialOpenedSections = !isEmpty(first(sections))
    ? [first(sections)?.slug]
    : []
  const [openedSections, setOpenedSections] = React.useState<string[]>(
    initialOpenedSections as string[],
  )

  const firstSection = sections && sections[0]
  const lessonType =
    sections && sections.length > 1
      ? 'section'
      : firstSection
      ? firstSection?.lessons && firstSection.lessons[0]._type
      : lessons && lessons[0]._type

  React.useEffect(() => {
    nextSection?.slug && setOpenedSections([nextSection?.slug])
  }, [nextSection?.slug])

  return moduleProgressStatus === 'success' ? (
    <nav
      data-module-navigator={moduleType}
      aria-label={`${moduleType} navigator`}
      //   className="w-full bg-black/20 px-5 py-8 lg:max-w-xs lg:bg-transparent lg:px-0 lg:py-0"
    >
      {sections && sections.length > 1 && (
        <Accordion.Root
          type="multiple"
          onValueChange={(e) => setOpenedSections(e)}
          value={openedSections}
        >
          <div
            data-module-navigator-header=""
            //   className="flex w-full items-center justify-between pb-3"
          >
            <h2
              data-title=""
              // className="text-2xl font-semibold"
            >
              Contents
            </h2>
            <h3
              data-byline=""
              //   className="cursor-pointer font-mono text-sm font-semibold uppercase text-gray-300"
              onClick={() => {
                setOpenedSections(
                  !isEmpty(openedSections)
                    ? []
                    : sections.map(({slug}: {slug: string}) => slug),
                )
              }}
            >
              {sections?.length || 0} {capitalize(lessonType || 'lesson')}s
            </h3>
          </div>
          <ul
            data-sections=""
            //   className="flex flex-col gap-2"
          >
            {sections.map((section: Section, i: number) => {
              return (
                <ModuleSection
                  key={section.slug}
                  section={section}
                  module={module}
                />
              )
            })}
          </ul>
        </Accordion.Root>
      )}
      {sections && sections.length === 1 && (
        <>
          <div
            data-module-navigator-header=""
            //   className="flex w-full items-center justify-between pb-3"
          >
            <h2
              data-title=""
              // className="text-2xl font-semibold"
            >
              Contents
            </h2>
            <h3
              data-byline=""
              // className="font-mono text-sm font-semibold uppercase text-gray-300"
            >
              {firstSection?.lessons?.length || 0}{' '}
              {capitalize(lessonType || 'lesson')}s
            </h3>
          </div>
          <ul data-sections="">
            {firstSection &&
              firstSection?.lessons?.map((lesson, idx) => {
                return (
                  <ModuleLesson
                    isInSection={false}
                    index={idx}
                    lessonResource={lesson}
                    section={sections[0]}
                    module={module}
                    key={lesson.slug}
                  />
                )
              })}
          </ul>
        </>
      )}
      {!sections && lessons && (
        <>
          <div
            data-module-navigator-header=""
            //   className="flex w-full items-center justify-between pb-3"
          >
            <h2
              data-title=""
              // className="text-2xl font-semibold"
            >
              Contents
            </h2>
            <h3
              data-byline=""
              // className="font-mono text-sm font-semibold uppercase text-gray-300"
            >
              {lessons?.length || 0} {capitalize(lessonType || 'lesson')}s
            </h3>
          </div>
          <ul data-sections="">
            {lessons?.map((lesson, idx) => {
              return (
                <ModuleLesson
                  isInSection={false}
                  index={idx}
                  lessonResource={lesson}
                  module={module}
                  key={lesson.slug}
                />
              )
            })}
          </ul>
        </>
      )}
    </nav>
  ) : (
    <ModuleNavigatorSkeleton
      sections={sections}
      lessons={lessons}
      lessonType={lessonType}
    />
  )
}

export default ModuleNavigator

const ModuleNavigatorSkeleton: React.FC<{
  sections: Section[] | null | undefined
  lessons: Lesson[] | null | undefined
  lessonType: string | null | undefined
}> = ({sections, lessons, lessonType}) => {
  const items = sections || lessons
  return (
    <div
      data-module-navigator-skeleton=""
      role="status"
      //   className="flex w-full animate-pulse flex-col gap-3 lg:max-w-xs"
    >
      <div
        data-header=""
        //   className="flex w-full items-center justify-between pb-3"
      >
        <h2
          data-title=""
          // className="text-2xl font-semibold"
        >
          Contents
        </h2>
        <h3
          data-byline=""
          // className="cursor-pointer font-mono text-sm font-semibold uppercase text-gray-300"
        >
          {items?.length || 0} {capitalize(lessonType || 'lesson')}s
        </h3>
      </div>
      {sections?.map((section) => {
        return (
          <div
            data-section=""
            key={section._id}
            //   className="flex flex-col gap-3 pb-5"
          >
            <div
              data-header=""
              // className="h-4 w-5/6 rounded-full bg-gray-700"
            />
            {section?.lessons?.map((lesson) => {
              return (
                <div
                  data-lesson=""
                  key={`${section._id}-${lesson._id}`}
                  //   className="h-3 rounded-full bg-gray-800"
                />
              )
            })}
          </div>
        )
      })}
      {lessons?.map((lesson) => {
        return (
          <div
            data-lesson=""
            key={lesson._id}
            //   className="flex flex-col"
          >
            <div
            // className="h-5 rounded-full bg-gray-700"
            />
          </div>
        )
      })}
    </div>
  )
}

const ModuleSection: React.FC<{
  section: Section
  module: Module
}> = ({section, module}) => {
  const moduleProgress = useModuleProgress()
  const sectionProgress = moduleProgress?.sections?.find(
    (s) => s.id === section._id,
  )
  const isSectionCompleted = sectionProgress?.sectionCompleted
  const sectionPercentComplete = sectionProgress?.percentComplete

  return (
    <li data-section="" key={section.slug}>
      <Accordion.Item value={section.slug}>
        <Accordion.Header
          data-header=""
          // className="relative z-10 overflow-hidden rounded-lg bg-gray-900"
        >
          <Accordion.Trigger
            data-trigger=""
            //   className="group relative z-10 flex w-full items-center justify-between rounded-lg border border-white/5 bg-gray-800/20 px-3 py-2.5 text-left text-lg font-medium leading-tight shadow-lg transition hover:bg-gray-800/40"
          >
            <Balancer>{section.title}</Balancer>
            <div
              data-icons=""
              // className="flex items-center"
            >
              {isSectionCompleted && (
                <CheckIcon
                  data-check=""
                  //   className="mr-2 h-4 w-4 text-teal-400"
                  aria-hidden="true"
                />
              )}
              <ChevronDownIcon
                data-chevron=""
                // className="relative h-3 w-3 opacity-70 transition group-hover:opacity-100 group-radix-state-open:rotate-180"
                aria-hidden="true"
              />
            </div>
          </Accordion.Trigger>
          <div
            data-progress={sectionPercentComplete?.toString()}
            aria-hidden="true"
            // className={`absolute left-0 top-0 h-full bg-white/5`}
            style={{width: `${sectionPercentComplete}%`}}
          />
        </Accordion.Header>
        <Accordion.Content>
          <ModuleSectionContent module={module} section={section} />
        </Accordion.Content>
      </Accordion.Item>
    </li>
  )
}

const ModuleLesson = ({
  lessonResource,
  section,
  module,
  index,
  isInSection = true,
}: {
  lessonResource: Lesson
  section?: Section
  module: Module
  index: number
  isInSection?: boolean
}) => {
  const moduleProgress = useModuleProgress()

  const completedLessons = moduleProgress?.lessons.filter(
    (l) => l.lessonCompleted,
  )
  const nextLesson = moduleProgress?.nextLesson
  const completedLessonCount = moduleProgress?.completedLessonCount || 0

  const isExerciseCompleted = completedLessons?.find(
    ({id}) => id === lessonResource._id,
  )

  const isNextLesson = nextLesson?.slug === lessonResource.slug
  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpcSkillLessons.modules.rules.useQuery({
        moduleSlug: module.slug.current,
        moduleType: module.moduleType,
        sectionSlug: section?.slug,
        lessonSlug: lessonResource.slug,
      })
    return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
  }
  const {ability, abilityRulesStatus} = useAbilities()

  // relying on ability would mark tutorials as locked because it's correctly checking for user
  // we don't want that here hence the moduleType check
  const canShowVideo =
    module.moduleType === 'tutorial' ||
    ability.can('view', 'Content') ||
    abilityRulesStatus === 'loading'
  const isHighlighted =
    (isNextLesson && completedLessons && completedLessons.length > 0) || false

  return (
    <li data-lesson="" key={lessonResource._id}>
      <Link
        href={
          section
            ? {
                pathname: `/${pluralize(
                  module.moduleType,
                )}/[module]/[section]/[lesson]`,
                query: {
                  section: section.slug,
                  lesson: lessonResource.slug,
                  module: module.slug.current,
                },
              }
            : {
                pathname: `/${pluralize(module.moduleType)}/[module]/[lesson]`,
                query: {
                  lesson: lessonResource.slug,
                  module: module.slug.current,
                },
              }
        }
        passHref
        data-is-in-section={isInSection.toString()}
        data-is-highlighted={isHighlighted.toString()}
        // className={cx(
        //   'group inline-flex w-full flex-col justify-center py-2.5 pl-3.5 pr-3 text-base font-medium',
        //   {
        //     'bg-gradient-to-r from-cyan-300/5 to-transparent':
        //       isNextLesson && completedLessons && completedLessons.length > 0,
        //     'rounded-md': !isInSection,
        //   },
        // )}
        onClick={() => {
          track('clicked workshop exercise', {
            module: module.slug.current,
            lesson: lessonResource.slug,
            ...(section && {section: section.slug}),
            moduleType: section ? section._type : module.moduleType,
            lessonType: lessonResource._type,
          })
        }}
      >
        {isNextLesson && completedLessonCount > 0 && (
          <div
            data-continue=""
            //   className="flex items-center gap-1 pb-1"
          >
            <ArrowRightIcon
              aria-hidden="true"
              data-icon=""
              //   className="-ml-1 mr-1.5 h-4 w-4 text-cyan-300"
            />
            <div
              data-label=""
              // className="font-mono text-xs font-semibold uppercase tracking-wide text-cyan-300"
            >
              CONTINUE
            </div>
          </div>
        )}
        <div
          data-title-container=""
          // className="inline-flex items-center"
        >
          {canShowVideo ? (
            <>
              {isExerciseCompleted ? (
                <CheckIcon
                  data-check-icon=""
                  //   className="-ml-1 mr-[11.5px] h-4 w-4 text-teal-400"
                  aria-hidden="true"
                />
              ) : (
                <span
                  data-index={`${index + 1}`}
                  //   className="w-6 font-mono text-xs text-gray-400"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
              )}
            </>
          ) : (
            <LockClosedIcon
              data-lock-icon=""
              aria-hidden="true"
              //   className="-ml-1 mr-[11.5px] h-4 w-4 text-gray-400"
            />
          )}
          <span
            data-title=""
            //   className="w-full cursor-pointer leading-tight group-hover:underline"
          >
            {lessonResource.title}
          </span>
        </div>
      </Link>
    </li>
  )
}

const ModuleSectionContent: React.FC<{
  section: Section
  module: Module
}> = ({section, module}) => {
  const {lessons} = section

  return lessons ? (
    <ul
      data-lessons=""
      // className="-mt-5 rounded-b-lg border border-white/5 bg-black/20 pb-3 pt-7"
    >
      {lessons.map((exercise: Lesson, i: number) => {
        return (
          <ModuleLesson
            key={exercise.slug}
            lessonResource={exercise}
            section={section}
            module={module}
            index={i}
          />
        )
      })}
    </ul>
  ) : null
}
