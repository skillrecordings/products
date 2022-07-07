import React from 'react'
import {CheckIcon, ChevronRightIcon} from '@heroicons/react/solid'
import {useProgress} from 'context/progress-context'
import {PortableText} from '@portabletext/react'
import {SkipNavContent} from '@reach/skip-nav'
import {SanityDocument} from '@sanity/client'
import {getOgImage} from 'utils/get-og-image'
import {LessonProgress} from '@prisma/client'
import {useSession} from 'next-auth/react'
import {Switch} from '@headlessui/react'
import {useReward} from 'react-rewards'
import {useRouter} from 'next/router'
import TableOfContents from 'components/portable-text/table-of-contents'
import PortableTextComponents from 'components/portable-text'
import BreadcrumbNav from 'components/breadcrumb'
import Layout from 'components/app/layout'
import Spinner from 'components/spinner'
import indexOf from 'lodash/indexOf'
import isEmpty from 'lodash/isEmpty'
import pluralize from 'pluralize'
import first from 'lodash/first'
import find from 'lodash/find'
import Link from 'next/link'
import cx from 'classnames'

type LessonTemplateProps = {
  module?: SanityDocument
  section: SanityDocument
  lesson: SanityDocument
}

const LessonTemplate: React.FC<LessonTemplateProps> = ({
  module,
  section,
  lesson,
}) => {
  const {data: session} = useSession()
  const {title, body, slug} = lesson
  const {lessons} = section
  const image = section?.image ?? module?.image
  const ogImage = getOgImage(title, image.url)
  const currentLessonIndex = indexOf(lessons, find(lessons, {slug}))
  const currentLessonIndexDisplay = currentLessonIndex + 1
  const {progress, toggleLessonComplete, isLoadingProgress} = useProgress()
  const currentLessonProgress = find(progress, {lessonSlug: slug})
  const isCurrentLessonCompleted = !isEmpty(currentLessonProgress?.completedAt)

  const nextLesson = lessons[currentLessonIndex + 1]
  const prevLesson = lessons[currentLessonIndex - 1] ?? null
  const nextSection =
    module &&
    module.sections[
      indexOf(module.sections, find(module.sections, {slug: section.slug})) + 1
    ]

  return (
    <Layout
      key={currentLessonIndex}
      meta={{
        title,
        ogImage,
      }}
      className="bg-white"
      skipNavContent={null}
    >
      <main>
        <div className="bg-gray-50">
          <div className="max-w-screen-lg mx-auto w-full py-4 lg:px-1 px-2 overflow-x-auto">
            <BreadcrumbNav
              module={module}
              section={section}
              lesson={lessons[currentLessonIndex]}
            />
          </div>
        </div>
        <SkipNavContent />
        <div className="w-full mx-auto flex-grow bg-white">
          <div>
            <article className="bg-green-700 bg-noise">
              <header className="relative py-16 min-h-[300px] px-4 max-w-screen-lg mx-auto rounded-md text-white flex flex-col items-center justify-center">
                <h1 className="text-center font-heading md:text-5xl text-4xl font-bold">
                  {title}
                </h1>
                <div
                  aria-hidden="true"
                  className="absolute text-[250px] font-nav opacity-10 mix-blend-overlay pb-10 font-bold pointer-events-none"
                >
                  {('0' + currentLessonIndexDisplay).slice(-2)}
                </div>
              </header>
              <div className="bg-white px-4">
                <TableOfContents value={body} />
                <div className="relative flex flex-col lg:py-10 py-8 max-w-screen-md w-full mx-auto">
                  <div className="max-w-none xl:prose-pre:text-base md:prose-pre:text-base prose-pre:text-xs prose-ul:sm:pr-0 prose-ul:pr-5 prose-p:w-full prose-ul:mx-auto text-gray-800 prose prose-headings:text-left prose-h3:text-green-800 md:prose-lg xl:prose-xl">
                    <PortableText
                      value={body}
                      components={PortableTextComponents}
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
        <div className="py-16 bg-green-700 bg-noise text-white w-full">
          <div
            className={cx(
              'max-w-screen-lg mx-auto w-full items-center justify-center lg:divide-x divide-green-600/75 divide-dashed lg:gap-10 gap-16',
              {
                'grid lg:grid-cols-2 grid-cols-1':
                  (nextLesson || nextSection) && session,
                flex: !nextLesson || !nextSection,
              },
            )}
          >
            {session && (
              <ProgressToggle
                isCurrentLessonCompleted={isCurrentLessonCompleted}
                toggleLessonComplete={toggleLessonComplete}
                slug={slug}
              />
            )}
            <UpNext
              module={module}
              section={section}
              nextLesson={nextLesson}
              nextSection={nextSection}
              currentLessonIndex={currentLessonIndex}
            />
          </div>
        </div>
      </main>
    </Layout>
  )
}

type ProgressToggleProps = {
  isCurrentLessonCompleted: boolean
  toggleLessonComplete: (slug: string) => Promise<void>
  slug: string
}

export const ProgressToggle: React.FC<ProgressToggleProps> = ({
  isCurrentLessonCompleted,
  toggleLessonComplete,
  slug,
}) => {
  const {reward} = useReward('rewardId', 'confetti', {
    zIndex: 50,
    lifetime: 50,
    startVelocity: 10,
    position: 'absolute',
  })
  const [isEnabled, setEnabled] = React.useState(isCurrentLessonCompleted)

  React.useEffect(() => {
    setEnabled(isCurrentLessonCompleted)
  }, [isCurrentLessonCompleted])

  const [isLoading, setLoading] = React.useState(false)
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-lg relative z-20">
      <div className="text-center pb-5">
        <p className="text-2xl font-bold font-heading">Finished this lesson?</p>
        <p className="text-sand-100">
          Mark it as complete to track your progress.
        </p>
      </div>
      <Switch.Group
        as="div"
        className="flex items-center px-4 py-3 bg-green-900/50 transition shadow-xl rounded-lg"
      >
        <Switch.Label as="span" className="mr-3 flex-shrink-0 cursor-pointer">
          <span className="text-white font-medium">Mark as complete</span>
        </Switch.Label>
        <Switch
          disabled={isLoading}
          checked={isEnabled}
          onChange={() => {
            setEnabled(!isEnabled)
            setLoading(true)
            toggleLessonComplete(slug)
              .then(() => {
                setLoading(false)
              })
              .catch(() => {
                setLoading(false)
                setEnabled(isCurrentLessonCompleted)
              })
            !isEnabled && reward()
          }}
          className={cx(
            'relative inline-flex shadow-inner disabled:opacity-80 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-all ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
            {
              'bg-green-500': isEnabled,
              'bg-white/30': !isEnabled,
            },
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              isEnabled ? 'translate-x-5' : 'translate-x-0',
              'items-center justify-center pointer-events-none inline-flex h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
            )}
          >
            {isLoading && (
              <Spinner
                className={cx('w-4', {
                  'text-green-600': isEnabled,
                  'text-gray-500': !isEnabled,
                })}
                aria-hidden="true"
              />
            )}
            {!isLoading && isEnabled && (
              <CheckIcon aria-hidden="true" className="text-green-600 w-4" />
            )}
          </span>
        </Switch>
        <span id="rewardId" />
      </Switch.Group>
    </div>
  )
}

type UpNextProps = {
  module?: SanityDocument
  section: SanityDocument
  nextLesson: SanityDocument
  nextSection: SanityDocument
  currentLessonIndex: number
}

const UpNext: React.FC<UpNextProps> = ({
  module,
  section,
  nextLesson,
  nextSection,
  currentLessonIndex,
}) => {
  const {lessons} = section
  const numberOfLessonsLeftInSection = lessons.length - currentLessonIndex - 1
  const nextSectionLesson: SanityDocument | undefined =
    nextSection && first(nextSection.lessons)

  return (
    <>
      {nextLesson ? (
        <div className="text-center flex flex-col items-center px-5">
          <p className="text-2xl font-heading font-bold pb-1">Up next</p>
          <p className="text-sand-100">
            There {pluralize('is', numberOfLessonsLeftInSection)}{' '}
            {numberOfLessonsLeftInSection} more{' '}
            {pluralize('lesson', numberOfLessonsLeftInSection)} in this section.
          </p>
          <Link
            passHref
            href={{
              pathname: module
                ? '/learn/[module]/[section]/[lesson]'
                : '/[section]/[lesson]',
              query: module
                ? {
                    module: module.slug,
                    section: section.slug,
                    lesson: nextLesson.slug,
                  }
                : {
                    section: section.slug,
                    lesson: nextLesson.slug,
                  },
            }}
          >
            <a className="focus-visible:ring-amber-500 transition-all mt-4 inline-flex items-center justify-center font-medium px-5 py-3 rounded-md bg-white shadow-lg hover:bg-white/90 text-black">
              <span>{nextLesson.title}</span>
              <ChevronRightIcon className="w-5" aria-hidden="true" />
            </a>
          </Link>
        </div>
      ) : (
        nextSection &&
        nextSectionLesson && (
          <div className="text-center lg:pl-10 flex flex-col items-center">
            <p className="text-2xl font-heading font-bold pb-1">Up next</p>
            <p className="text-sand-100">{nextSection.title}</p>
            <Link
              passHref
              href={{
                pathname: module
                  ? '/learn/[module]/[section]/[lesson]'
                  : '/[section]/[lesson]',
                query: module
                  ? {
                      module: module.slug,
                      section: nextSection.slug,
                      lesson: nextSectionLesson.slug,
                    }
                  : {
                      section: nextSection.slug,
                      lesson: nextSectionLesson.slug,
                    },
              }}
            >
              <a className="focus-visible:ring-amber-500 transition-all mt-4 inline-flex items-center justify-center font-medium px-5 py-3 rounded-md bg-white shadow-lg hover:bg-white/90 text-black">
                <span>{nextSectionLesson.title}</span>
                <ChevronRightIcon className="w-5" aria-hidden="true" />
              </a>
            </Link>
          </div>
        )
      )}
    </>
  )
}

type LessonNavigatorProps = {
  lessons: SanityDocument[]
  progress: LessonProgress[]
  module?: SanityDocument
  section: SanityDocument
  currentLessonIndex: number
  isLoadingProgress: boolean
  className?: string
}

const LessonNavigator: React.FC<LessonNavigatorProps> = ({
  lessons,
  progress,
  module,
  section,
  currentLessonIndex,
  isLoadingProgress,
  className = '',
}) => {
  const router = useRouter()
  if (!lessons) return null
  return (
    <aside className={className}>
      <nav aria-label="lesson navigator">
        <strong className="font-bold pb-4 flex">
          <span>Lessons</span>
          {isLoadingProgress && (
            <Spinner aria-hidden="true" className="ml-2 w-4 opacity-60" />
          )}
        </strong>
        <ol role="list" className="list-none flex flex-col pl-2">
          {lessons.map((lesson: SanityDocument, i: number) => {
            const {title, slug} = lesson
            const isActive = router.query.lesson === slug
            const isCompleted = find(progress, {
              lessonSlug: slug,
            })?.completedAt
            return (
              <li className=" group" key={slug}>
                <Link
                  href={{
                    pathname: module
                      ? '/learn/[module]/[section]/[lesson]'
                      : '/[section]/[lesson]',
                    query: module
                      ? {
                          module: module.slug,
                          section: section.slug,
                          lesson: slug,
                        }
                      : {
                          section: section.slug,
                          lesson: slug,
                        },
                  }}
                  passHref
                >
                  <a
                    data-index={isCompleted ? '✓' : i + 1}
                    aria-current={currentLessonIndex === i ? 'page' : undefined}
                    aria-label={`${title} ${isCompleted ? '(completed)' : ''}`}
                    className={cx(
                      `text-sm pl-5 pt-0.5 py-5 hover:text-gray-900 text-gray-700 relative flex after:font-semibold after:flex after:items-center after:justify-center after:font-mono after:absolute after:content-[attr(data-index)] after:w-5 after:h-5 after:border after:bg-white after:-left-2.5 after:rounded-full after:top-0.5 group-last-of-type:before:hidden before:absolute before:h-full before:left-[0] before:w-[1px] before:bg-gray-200 before:top-4`,
                      {
                        'font-bold after:border-gray-500 after:text-gray-800 after:font-bold text-gray-900':
                          isActive && !isCompleted,
                        '': !isActive,
                        'after:text-[0.55em] after:text-gray-500 after:border-gray-300':
                          !isCompleted,
                        'after:text-sm after:text-white after:border-green-600 after:bg-green-600':
                          isCompleted && !isActive,
                        'after:text-white after:border-green-600 after:bg-green-600 font-bold':
                          isCompleted && isActive,
                      },
                    )}
                  >
                    {title}{' '}
                    {isCompleted && (
                      <span className="sr-only">(completed)</span>
                    )}
                  </a>
                </Link>
              </li>
            )
          })}
        </ol>
      </nav>
    </aside>
  )
}

export default LessonTemplate
