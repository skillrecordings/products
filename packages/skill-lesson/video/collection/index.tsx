import React from 'react'
import {type Module} from '../../schemas/module'
import {type Section as SectionType} from '../../schemas/section'
import {type Lesson as LessonType} from '../../schemas/lesson'
import {useLesson} from '../../hooks/use-lesson'
import {track} from '../../utils/analytics'
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'
import {type Scope, createContextScope} from '@radix-ui/react-context'
import {Primitive} from '@radix-ui/react-primitive'
import type * as Radix from '@radix-ui/react-primitive'
import {capitalize, first, isEmpty, replace} from 'lodash'
import {trpcSkillLessons} from '../../utils/trpc-skill-lessons'
import Link from 'next/link'
import pluralize from 'pluralize'
import {type SectionProgress, useModuleProgress} from '../module-progress'
import {CheckIcon, LockIcon} from 'lucide-react'
import {createAppAbility} from '../../utils/ability'
import {cn} from '../../../ui/utils/cn'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import {useRouter} from 'next/router'

/* -------------------------------------------------------------------------------------------------
 * Collection
 * -----------------------------------------------------------------------------------------------*/

const COLLECTION_NAME = 'Module Contents'

type ScopedProps<P> = P & {__scopeCollection?: Scope}
const [createCollectionContext, createCollectionScope] =
  createContextScope(COLLECTION_NAME)

type CollectionContextValue = {
  module: Module
  openedSections: string[]
  setOpenedSections: React.Dispatch<React.SetStateAction<string[]>>
  checkIconRenderer: () => React.ReactNode
  lockIconRenderer: () => React.ReactNode
  sectionProgressRenderer: (
    sectionProgress?: SectionProgress,
  ) => React.ReactNode
  resourcesRenderer?: (type?: string) => React.ReactNode
  path?: string
}
const [CollectionProvider, useCollectionContext] =
  createCollectionContext<CollectionContextValue>(COLLECTION_NAME)

type CollectionElement = React.ElementRef<typeof Primitive.div>
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>
interface CollectionProps extends PrimitiveDivProps {
  module: Module
  checkIconRenderer?: () => React.ReactNode
  lockIconRenderer?: () => React.ReactNode
  sectionProgressRenderer?: (
    sectionProgress?: SectionProgress,
  ) => React.ReactNode
  resourcesRenderer?: (type?: string) => React.ReactNode
}

const Collection = React.forwardRef<CollectionElement, CollectionProps>(
  (props: ScopedProps<CollectionProps>, forwardedRef) => {
    const {
      __scopeCollection,
      module,

      children,
      checkIconRenderer = () => (
        <CheckIcon
          className="relative z-10 flex-shrink-0"
          width={16}
          opacity={0.7}
          data-check-icon=""
          aria-hidden="true"
        />
      ),
      lockIconRenderer = () => (
        <LockIcon
          className="relative z-10 flex-shrink-0"
          width={13}
          data-lock-icon=""
          aria-hidden="true"
        />
      ),
      sectionProgressRenderer = (sectionProgress) => {
        const isSectionInProgress = Boolean(
          sectionProgress?.completedLessonCount,
        )
        const isSectionCompleted = sectionProgress?.sectionCompleted
        const sectionPercentComplete = sectionProgress?.percentComplete

        return (
          <>
            {isSectionCompleted && checkIconRenderer()}
            {isSectionInProgress && (
              <div
                data-progress={sectionPercentComplete?.toString()}
                aria-hidden="true"
                className={`absolute pointer-events-none left-0 bottom-0 h-full bg-background/75`}
                style={{width: `${sectionPercentComplete}%`}}
              />
            )}
          </>
        )
      },
      resourcesRenderer,
      ...collectionProps
    } = props
    const {sections, lessons} = module
    const {section: currentSection} = useLesson()
    const router = useRouter()
    const path = router.route.match(/^\/([^/]+)/)?.[1]
    const moduleProgress = useModuleProgress()

    const nextSection = moduleProgress?.nextSection
    const firstSection = first<SectionType>(sections)

    const initialOpenedSections = currentSection
      ? [currentSection?.slug]
      : !isEmpty(firstSection)
      ? [firstSection?.slug]
      : []
    const [openedSections, setOpenedSections] = React.useState<string[]>(
      initialOpenedSections as string[],
    )

    const {section: activeSection} = useLesson()

    const hasSections = sections && sections.length > 0
    const onlyHasSingleSection = hasSections && sections.length === 1

    const childrenForSingleSection = React.Children.map(children, (child) => {
      if (React.isValidElement<LessonsProps>(child)) {
        if (child.type === Lessons) {
          return React.cloneElement(child, {
            section: firstSection,
          })
        }
        if (child.type === Sections) {
          return null
        }
        return child
      }
      return null
    })

    React.useEffect(() => {
      if (!activeSection && nextSection?.slug) {
        setOpenedSections([nextSection?.slug])
      }
    }, [nextSection?.slug, activeSection])

    return (
      <CollectionProvider
        module={module}
        openedSections={openedSections}
        sectionProgressRenderer={sectionProgressRenderer}
        setOpenedSections={setOpenedSections}
        checkIconRenderer={checkIconRenderer}
        lockIconRenderer={lockIconRenderer}
        path={path}
        scope={__scopeCollection}
        resourcesRenderer={resourcesRenderer}
      >
        <TooltipProvider>
          {children ? (
            <>{onlyHasSingleSection ? childrenForSingleSection : children}</>
          ) : (
            <>
              <Metadata />
              {hasSections && !onlyHasSingleSection && <Sections />}
              {!hasSections && lessons && <Lessons />}
              {onlyHasSingleSection && <Lessons section={firstSection} />}
            </>
          )}
        </TooltipProvider>
      </CollectionProvider>
    )
  },
)

Collection.displayName = COLLECTION_NAME

/* -------------------------------------------------------------------------------------------------
 * Metadata
 * -----------------------------------------------------------------------------------------------*/

const METADATA_NAME = 'Module Metadata'

type MetadataElement = React.ElementRef<typeof Primitive.div>

interface MetadataProps extends PrimitiveDivProps {
  className?: string
}

const Metadata = React.forwardRef<MetadataElement, MetadataProps>(
  (props: ScopedProps<MetadataProps>, forwardedRef) => {
    const {__scopeCollection, children, className, ...sectionsProps} = props
    const {module, setOpenedSections, openedSections} = useCollectionContext(
      COLLECTION_NAME,
      __scopeCollection,
    )
    const {sections, lessons} = module

    const handleToggleAllSections = (sections?: SectionType[] | null) => {
      if (sections) {
        setOpenedSections(
          isEmpty(openedSections)
            ? sections.map(({slug}: {slug: string}) => slug)
            : [],
        )
      }
    }

    const firstSection = first<SectionType>(sections)

    return (
      <Primitive.div {...sectionsProps} ref={forwardedRef}>
        {children}
        {sections && sections.length === 1 && firstSection?.lessons ? (
          <p className={className}>
            {firstSection.lessons.length || 0}{' '}
            {capitalize(pluralize('lesson', firstSection.lessons.length))}
          </p>
        ) : sections && sections.length > 1 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={className}
                aria-label={`Toggle all sections`}
                onClick={() => handleToggleAllSections(sections)}
              >
                {sections?.length || 0}{' '}
                {capitalize(pluralize('section', sections.length))}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle sections</p>
            </TooltipContent>
          </Tooltip>
        ) : lessons ? (
          <p className={className}>
            {lessons.length || 0}{' '}
            {capitalize(pluralize(lessons[0]._type, lessons.length))}
          </p>
        ) : null}
      </Primitive.div>
    )
  },
)

Metadata.displayName = METADATA_NAME

/* -------------------------------------------------------------------------------------------------
 * Sections
 * -----------------------------------------------------------------------------------------------*/

const SECTIONS_NAME = 'Sections'

type SectionsElement = React.ElementRef<typeof Primitive.ul>
type PrimitiveUlProps = Radix.ComponentPropsWithoutRef<typeof Primitive.ul>
interface SectionsProps extends PrimitiveUlProps {}

const Sections = React.forwardRef<SectionsElement, SectionsProps>(
  (props: ScopedProps<SectionsProps>, forwardedRef) => {
    const {__scopeCollection, children, ...sectionsProps} = props
    const {module, openedSections, setOpenedSections} = useCollectionContext(
      COLLECTION_NAME,
      __scopeCollection,
    )
    const {section: currentSection} = useLesson()

    React.useLayoutEffect(() => {
      currentSection && setOpenedSections([currentSection.slug])
    }, [currentSection])

    const handleOnAccordionValueChange = (value: string[]) => {
      if (currentSection) {
        // only allow one section to be open at a time on lesson pages
        setOpenedSections([value[value.length - 1]])
      } else {
        setOpenedSections(value)
      }
    }

    if (!module.sections) return null

    return (
      <Accordion
        type="multiple"
        onValueChange={handleOnAccordionValueChange}
        value={openedSections}
        defaultValue={openedSections}
      >
        <Primitive.ul
          {...sectionsProps}
          ref={forwardedRef}
          className={cn('space-y-2', sectionsProps.className)}
        >
          {module.sections?.map?.((section) => {
            const childrenWithProps = React.Children.map(children, (child) => {
              if (React.isValidElement<SectionProps>(child)) {
                return React.cloneElement(child, {
                  key: section._id,
                  section: section,
                })
              }
              return null
            })

            return (
              childrenWithProps || (
                <Section key={section._id} section={section} />
              )
            )
          })}
        </Primitive.ul>
      </Accordion>
    )
  },
)

Sections.displayName = SECTIONS_NAME

/* -------------------------------------------------------------------------------------------------
 * Section
 * -----------------------------------------------------------------------------------------------*/

const SECTION_NAME = 'Section'

type SectionElement = React.ElementRef<typeof AccordionPrimitive.Trigger>
type TriggerProps = Radix.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
>
interface SectionProps extends TriggerProps {
  section?: SectionType
}

const Section = React.forwardRef<SectionElement, SectionProps>(
  (props: ScopedProps<SectionProps>, forwardedRef) => {
    const {__scopeCollection, section, children, ...sectionProps} = props
    const {sectionProgressRenderer} = useCollectionContext(
      COLLECTION_NAME,
      __scopeCollection,
    )

    const moduleProgress = useModuleProgress()

    if (!section) return null

    const sectionProgress = moduleProgress?.sections?.find(
      (s) => s.id === section._id,
    )
    const isSectionInProgress = Boolean(sectionProgress?.completedLessonCount)

    const hasLessons = Boolean(section.lessons)

    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement<LessonsProps>(child)) {
        return React.cloneElement(child, {
          key: section._id,
          section: section,
        })
      }
      return null
    })

    return (
      <li>
        <AccordionItem className="border-none" value={section.slug}>
          <AccordionHeader>
            <AccordionTrigger
              ref={forwardedRef}
              {...sectionProps}
              className={cn(
                "relative font-semibold text-left overflow-hidden data-[state='closed']:rounded data-[state='open']:rounded-t data-[check-icon]:w-4 [&>[data-check-icon]]:ml-auto [&>[data-check-icon]]:mr-2 bg-card px-4 py-4",
                sectionProps.className,
                {
                  '[&>[data-chevron]]:hidden': !hasLessons,
                },
              )}
            >
              <span className="relative z-10">
                {section.title} {!hasLessons && '(coming soon)'}
              </span>
              {isSectionInProgress && sectionProgressRenderer(sectionProgress)}
            </AccordionTrigger>
          </AccordionHeader>
          {hasLessons && (
            <AccordionContent>
              {children ? childrenWithProps : <Lessons section={section} />}
            </AccordionContent>
          )}
        </AccordionItem>
      </li>
    )
  },
)

Section.displayName = SECTION_NAME

/* -------------------------------------------------------------------------------------------------
 * Lessons
 * -----------------------------------------------------------------------------------------------*/

const LESSONS_NAME = 'Lessons'

type LessonsElement = React.ElementRef<typeof Primitive.ul>
interface LessonsProps extends PrimitiveUlProps {
  section?: SectionType
}

const Lessons = React.forwardRef<LessonsElement, LessonsProps>(
  (props: ScopedProps<LessonsProps>, forwardedRef) => {
    const {__scopeCollection, section, children, ...lessonsProps} = props
    const {module} = useCollectionContext(COLLECTION_NAME, __scopeCollection)
    const lessons = section?.lessons || module.lessons
    if (!lessons) return null

    return (
      <Primitive.ul
        ref={forwardedRef}
        {...lessonsProps}
        className={cn(
          'bg-background border-x border-b border-card py-2 rounded-b',
          lessonsProps.className,
        )}
      >
        {lessons.map((lesson, index) => {
          const childrenWithProps = React.Children.map(children, (child) => {
            if (React.isValidElement<LessonProps>(child)) {
              return React.cloneElement(child, {
                lesson: lesson,
                section: section,
                index: index,
              })
            }
            return null
          })
          return (
            <li key={lesson._id}>
              {childrenWithProps || (
                <Lesson section={section} lesson={lesson} index={index} />
              )}
            </li>
          )
        })}
      </Primitive.ul>
    )
  },
)

Lessons.displayName = LESSONS_NAME

/* -------------------------------------------------------------------------------------------------
 * Lesson
 * -----------------------------------------------------------------------------------------------*/

const LESSON_NAME = 'Lesson'

type LessonElement = React.ElementRef<typeof Primitive.li>
type PrimitiveLiProps = Radix.ComponentPropsWithoutRef<typeof Primitive.li>
interface LessonProps extends PrimitiveLiProps {
  lesson?: LessonType
  section?: SectionType
  index?: number
  scrollContainerRef?: React.RefObject<HTMLDivElement>
}

const Lesson = React.forwardRef<LessonElement, LessonProps>(
  (props: ScopedProps<LessonProps>, forwardedRef) => {
    const {
      __scopeCollection,
      lesson,
      section,
      index = 0,
      children,
      scrollContainerRef,
      ...lessonProps
    } = props
    const {module, checkIconRenderer, lockIconRenderer, path, openedSections} =
      useCollectionContext(COLLECTION_NAME, __scopeCollection)
    const moduleProgress = useModuleProgress()

    const useAbilities = () => {
      const {data: abilityRules, status: abilityRulesStatus} =
        trpcSkillLessons.modules.rules.useQuery({
          moduleSlug: module.slug.current,
          moduleType: module.moduleType,
          sectionSlug: section?.slug,
          lessonSlug: lesson?.slug,
        })
      return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
    }
    const {ability, abilityRulesStatus} = useAbilities()

    const completedLessons = moduleProgress?.lessons.filter(
      (l) => l.lessonCompleted,
    )
    const nextLesson = moduleProgress?.nextLesson
    const completedLessonCount = moduleProgress?.completedLessonCount || 0

    const isLessonCompleted = completedLessons?.find(
      ({id}) => id === lesson?._id,
    )

    const isNextLesson = nextLesson?.slug === lesson?.slug

    // relying on ability would mark tutorials as locked because it's correctly checking for user
    // we don't want that for tutorials hence the moduleType check
    const canShowVideo =
      module.moduleType === 'tutorial' ||
      ability.can('view', 'Content') ||
      abilityRulesStatus === 'loading'

    const isHighlighted =
      (isNextLesson && completedLessons && completedLessons.length > 0) || false

    const showContinue = isNextLesson && completedLessonCount > 0

    const router = useRouter()
    const currentPath = section
      ? `${path}/${module.slug.current}/${section.slug}/${lesson?.slug}`
      : `${path}/${module.slug.current}/${lesson?.slug}`

    const isActive = router.asPath.includes(currentPath)
    const {lesson: activeLesson} = useLesson()
    const isLessonActive = activeLesson?.slug === lesson?.slug

    const scrollElRef = React.useRef<HTMLDivElement>(null)
    const activeElementToScrollTo = scrollElRef

    useScrollToActiveLesson(activeElementToScrollTo, scrollContainerRef)

    if (!lesson) return null

    return (
      <Primitive.li
        data-active={isLessonActive.toString()}
        asChild
        {...lessonProps}
        className={cn(
          `[&_[data-item]]:flex [&_[data-item]]:py-2 [&_[data-item]]:px-3 [&_[data-item]]:text-left [&_[data-item]>div]:w-full [&_[data-item]:has(span)]:items-baseline [&_[data-item]]:gap-2 [&_[data-item]>span]:text-xs [&_[data-item]>span]:opacity-60 text-base font-medium flex flex-col`,
          {
            'before:content-["continue"] before:mt-2 before:-mb-1 before:text-xs before:font-semibold before:pl-10 before:text-primary before:uppercase before:block':
              showContinue,
            '[&_[data-item]:px-2': section,
            'bg-card [&>div]:px-2.5': !section,
          },
          lessonProps.className,
        )}
        ref={forwardedRef}
      >
        <div>
          {isLessonActive && <div ref={scrollElRef} aria-hidden="true" />}
          {isActive && children ? (
            <Accordion
              type="multiple"
              defaultValue={[lesson.slug]}
              className="[&_[data-chevron]]:hidden"
              disabled
            >
              <AccordionItem value={lesson.slug} className="border-none">
                <AccordionHeader>
                  <AccordionTrigger data-item={lesson._type}>
                    {canShowVideo ? (
                      <>
                        {isLessonCompleted ? (
                          checkIconRenderer()
                        ) : (
                          <span
                            className="w-4 h-4 flex items-center justify-center"
                            data-index={`${index + 1}`}
                            aria-hidden="true"
                          >
                            {index + 1}
                          </span>
                        )}
                      </>
                    ) : (
                      lockIconRenderer()
                    )}
                    <div>{lesson.title}</div>
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>{children}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <>
              {isLessonActive && <div ref={scrollElRef} aria-hidden="true" />}
              <Link
                data-item={lesson._type}
                href={getLessonHref(lesson, module, section)}
                passHref
                scroll={activeLesson ? false : true}
              >
                {canShowVideo ? (
                  <>
                    {isLessonCompleted ? (
                      checkIconRenderer()
                    ) : (
                      <span
                        className="w-4 h-4 flex items-center justify-center"
                        data-index={`${index + 1}`}
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                    )}
                  </>
                ) : (
                  lockIconRenderer()
                )}
                <div>{lesson.title}</div>
              </Link>
            </>
          )}
        </div>
      </Primitive.li>
    )
  },
)

Lesson.displayName = LESSON_NAME

/* ------------------------------------------------------------------------------------------------- */

const RESOURCES_NAME = 'Resources'

type ResourcesElement = React.ElementRef<typeof Primitive.ul>

interface ResourcesProps extends PrimitiveUlProps {}

const Resources = React.forwardRef<ResourcesElement, ResourcesProps>(
  (props: ScopedProps<ResourcesProps>, forwardedRef) => {
    const {__scopeCollection, children, ...resourcesProps} = props
    const {lesson} = useLesson()
    const {resourcesRenderer} = useCollectionContext(
      COLLECTION_NAME,
      __scopeCollection,
    )

    if (!resourcesRenderer) return null

    return (
      <Primitive.ul ref={forwardedRef} {...resourcesProps}>
        {resourcesRenderer(lesson._type)}
      </Primitive.ul>
    )
  },
)

/* -------------------------------------------------------------------------------------------------
 * Resources
 * -----------------------------------------------------------------------------------------------*/

Resources.displayName = RESOURCES_NAME

const RESOURCE_NAME = 'Resource'

type ResourceElement = React.ElementRef<typeof Primitive.li>

interface ResourceProps extends PrimitiveLiProps {
  /**
   * Path is appended to the lesson link (e.g. /module/lesson/**problem**)
   */
  path?: string
  type?: string
}

const useSesourceLinkBuilder = (modulePath?: string, resourcePath?: string) => {
  const {section, module, lesson} = useLesson()

  const pathname = `/[module]/${section ? `[section]/` : ``}[lesson]`
  const href = `/${module.slug.current}/${section ? `${section.slug}/` : ``}${
    lesson.slug
  }`

  return {
    resourcePathname:
      '/' +
      modulePath +
      (resourcePath ? pathname + `/${resourcePath}` : pathname),
    resourceHref:
      '/' + modulePath + (resourcePath ? href + `/${resourcePath}` : href),
  }
}

/* -------------------------------------------------------------------------------------------------
 * Resource
 * -----------------------------------------------------------------------------------------------*/

/**
 * Represents a resource that is linked to a lesson. Such as a **problem, exercise, or solution**.
 * @param {string} path (optional) gets appended to the lesson link (e.g. /module/lesson/**problem**)
 * @constructor
 */
const Resource = React.forwardRef<ResourceElement, ResourceProps>(
  (props: ScopedProps<ResourceProps>, forwardedRef) => {
    const {__scopeCollection, path, children, ...resourceProps} = props
    const {lesson, section} = useLesson()
    const {module, path: modulePath} = useCollectionContext(
      COLLECTION_NAME,
      __scopeCollection,
    )

    const router = useRouter()

    const {resourcePathname, resourceHref} = useSesourceLinkBuilder(
      modulePath,
      path,
    )
    const isActive = router.asPath === resourceHref

    return (
      <Primitive.li
        {...resourceProps}
        className={cn('[&>a]:px-[34px] [&>a]:py-2', resourceProps.className)}
        ref={forwardedRef}
      >
        <Link
          data-active={isActive.toString()}
          href={{
            pathname: resourcePathname,
            query: {
              module: module.slug.current,
              lesson: lesson.slug,
              ...(section && {section: section.slug}),
            },
          }}
          passHref
          onClick={() => {
            track(`clicked lesson resource in navigator`, {
              module: module.slug.current,
              lesson: lesson.slug,
              ...(section && {section: section.slug}),
              location: router.query.lesson,
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
          }}
        >
          {children}
        </Link>
      </Primitive.li>
    )
  },
)

Resource.displayName = RESOURCE_NAME

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------------------------*/

const getLessonHref = (
  lesson: LessonType,
  module: Module,
  section?: SectionType,
) => {
  const pathname = `/${pluralize(module.moduleType)}/[module]/${
    section ? '[section]/' : ''
  }[lesson]`
  const query = {
    lesson: lesson.slug,
    module: module.slug.current,
    ...(section && {section: section.slug}),
  }
  return {pathname, query}
}

const useScrollToActiveLesson = (
  activeElementToScrollTo: React.RefObject<HTMLDivElement>,
  scrollContainerRef?: React.RefObject<HTMLDivElement>,
) => {
  React.useEffect(() => {
    const activeElementOffset = activeElementToScrollTo?.current?.offsetTop

    activeElementOffset &&
      scrollContainerRef?.current?.scrollTo({
        top: activeElementOffset,
      })
  }, [activeElementToScrollTo, scrollContainerRef])
}

/* -------------------------------------------------------------------------------------------------*/

const Root = Collection

export {
  Collection,
  Root,
  Metadata,
  Section,
  Sections,
  Lessons,
  Lesson,
  Resources,
  Resource,
}
