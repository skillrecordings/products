import React from 'react'
import {CheckIcon, ChevronRightIcon} from '@heroicons/react/solid'
import {useProgress} from 'context/progress-context'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {LessonProgress} from '@prisma/client'
import {Switch} from '@headlessui/react'
import {useReward} from 'react-rewards'
import {useRouter} from 'next/router'
import PortableTextComponents from 'components/portable-text'
import BreadcrumbNav from 'components/breadcrumb'
import Layout from 'components/app/layout'
import Spinner from 'components/spinner'
import indexOf from 'lodash/indexOf'
import isEmpty from 'lodash/isEmpty'
import pluralize from 'pluralize'
import first from 'lodash/first'
import Image from 'next/image'
import find from 'lodash/find'
import Link from 'next/link'
import cx from 'classnames'

type LessonTemplateProps = {
  module: SanityDocument
  section: SanityDocument
  lesson: SanityDocument
}

const LessonTemplate: React.FC<LessonTemplateProps> = ({
  module,
  section,
  lesson,
}) => {
  const {title, body, slug} = lesson
  const {lessons, image} = section
  const currentLessonIndex = indexOf(lessons, find(lessons, {slug}))

  const {progress, toggleLessonComplete, isLoadingProgress} = useProgress()
  const currentLessonProgress = find(progress, {lessonSlug: slug})
  const isCurrentLessonCompleted = !isEmpty(currentLessonProgress?.completedAt)

  const nextLesson = lessons[currentLessonIndex + 1]
  const prevLesson = lessons[currentLessonIndex - 1] ?? null
  const nextSection =
    module.sections[
      indexOf(module.sections, find(module.sections, {slug: section.slug})) + 1
    ]

  return (
    <Layout className="bg-white">
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
        <div className="max-w-screen-lg w-full mx-auto flex-grow bg-white ">
          <div className="py-10 bg-white lg:px-0 px-4">
            <article className="mx-auto">
              <header className="flex md:flex-row flex-col items-center justify-between lg:pb-10 sm:pb-16 pb-16">
                <h1 className="w-full tracking-tight lg:text-5xl sm:text-4xl text-4xl font-extrabold lg:max-w-screen-sm md:text-left text-center md:pb-0 pb-12 lg:px-0 px-10">
                  {title}
                </h1>
                <div className="flex items-center justify-center max-w-xs">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    quality={100}
                    width={360}
                    height={360}
                  />
                </div>
              </header>
              <div className="relative flex w-full lg:grid flex-col sm:grid-cols-12 gap-8 md:border-t border-gray-100 pt-10">
                <div className="prose lg:prose-lg max-w-none sm:col-span-9">
                  <PortableText
                    value={body}
                    components={PortableTextComponents}
                  />
                </div>
                <div className="col-span-3">
                  <LessonNavigator
                    className="pt-1.5 lg:block hidden"
                    lessons={lessons}
                    progress={progress}
                    module={module}
                    section={section}
                    currentLessonIndex={currentLessonIndex}
                    isLoadingProgress={isLoadingProgress}
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
        <div className="py-16 bg-gray-50 w-full">
          <div
            className={cx(
              'max-w-screen-lg mx-auto w-full items-center justify-center lg:divide-x divide-gray-200 lg:gap-10 gap-16',
              {
                'grid lg:grid-cols-2 grid-cols-1': nextLesson || nextSection,
                flex: !nextLesson || !nextSection,
              },
            )}
          >
            <ProgressToggle
              isCurrentLessonCompleted={isCurrentLessonCompleted}
              toggleLessonComplete={toggleLessonComplete}
              slug={slug}
            />
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

const ProgressToggle: React.FC<ProgressToggleProps> = ({
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
    <div className="flex flex-col items-center justify-center rounded-lg relative z-50">
      <div className="text-center pb-5">
        <p className="text-xl font-bold">Finished this lesson?</p>
        <p className="text-gray-700">
          Mark it as complete to track your progress.
        </p>
      </div>
      <Switch.Group
        as="div"
        className="flex items-center px-4 py-3 bg-white shadow-sm rounded-lg"
      >
        <Switch.Label as="span" className="mr-3 flex-shrink-0 cursor-pointer">
          <span className="text-gray-900 font-medium">Mark as complete</span>
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
            'relative inline-flex disabled:opacity-80 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-all ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
            {
              'bg-green-600': isEnabled,
              'bg-gray-200': !isEnabled,
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
  module: SanityDocument
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
        <div className="text-center">
          <p className="text-xl font-bold pb-1">Up next</p>
          <p className="text-gray-700">
            There {pluralize('is', numberOfLessonsLeftInSection)}{' '}
            {numberOfLessonsLeftInSection} more{' '}
            {pluralize('lesson', numberOfLessonsLeftInSection)} in this section.
          </p>
          <Link
            passHref
            href={`/learn/${module.slug}/${section.slug}/${nextLesson.slug}`}
          >
            <a className="transition-all mt-4 inline-flex items-center justify-center font-medium px-5 py-3 rounded-md bg-gray-900 text-white">
              <span>{nextLesson.title}</span>
              <ChevronRightIcon className="w-5" aria-hidden="true" />
            </a>
          </Link>
        </div>
      ) : (
        nextSection &&
        nextSectionLesson && (
          <div className="text-center lg:pl-10">
            <p className="text-xl font-bold pb-1">Up next</p>
            <p className="text-gray-700">{nextSection.title}</p>
            <Link
              passHref
              href={`/learn/${module.slug}/${nextSection.slug}/${nextSectionLesson.slug}`}
            >
              <a className="transition-all mt-4 inline-flex items-center justify-center font-medium px-5 py-3 rounded-md bg-gray-900 text-white">
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
  module: SanityDocument
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
                    pathname: '/learn/[module]/[section]/[lesson]',
                    query: {
                      module: module.slug,
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
