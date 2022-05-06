import React from 'react'
import {CheckIcon, ChevronRightIcon} from '@heroicons/react/solid'
import {useProgress} from 'context/progress-context'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
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
  const {lessons} = section
  const currentLessonIndex = indexOf(lessons, find(lessons, {slug}))
  const router = useRouter()

  const {progress, toggleLessonComplete} = useProgress()
  const currentLessonProgress = find(progress, {lessonSlug: slug})
  const isCurrentLessonCompleted = !isEmpty(currentLessonProgress?.completedAt)

  const numberOfLessonsLeftInSection = lessons.length - currentLessonIndex - 1
  const nextLesson = lessons[currentLessonIndex + 1]
  const prevLesson = lessons[currentLessonIndex - 1] ?? null

  const ProgressToggle = () => {
    const {reward} = useReward('rewardId', 'confetti', {
      zIndex: 50,
      lifetime: 50,
      startVelocity: 10,
      position: 'absolute',
    })
    const [isEnabled, setEnabled] = React.useState(isCurrentLessonCompleted)
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

  return (
    <Layout className="bg-white">
      <div className="bg-gray-100">
        <div className="max-w-screen-lg mx-auto w-full py-4 lg:px-2 px-4">
          <BreadcrumbNav
            module={module}
            section={section}
            lesson={lessons[currentLessonIndex]}
          />
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto grid grid-cols-12 flex-grow bg-white">
        <aside className="col-span-3">
          {lessons && (
            <nav aria-label="lesson navigator" className="px-2 py-8">
              <h3 className="font-bold pb-4">Lesson Navigator</h3>
              <ol role="list" className="list-none flex flex-col pl-2">
                {lessons.map((lesson: SanityDocument, i: number) => {
                  const {title, slug} = lesson
                  const isActive = router.query.lesson === slug
                  const isCompleted = find(progress, {
                    lessonSlug: slug,
                  })?.completedAt
                  return (
                    <li className="pb-3 group" key={slug}>
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
                          data-index={i + 1}
                          className={cx(
                            `text-sm pl-5 relative flex after:font-semibold after:text-gray-500 after:flex after:items-center after:justify-center after:text-[0.55em] after:font-mono after:absolute after:content-[attr(data-index)] after:w-5 after:h-5 after:border after:border-gray-300 after:bg-white after:-left-2.5 after:rounded-full after:top-0.5 group-last-of-type:before:hidden before:absolute before:h-full before:left-[0] before:w-[1px] before:bg-gray-300 before:top-4`,
                            {
                              'font-semibold': isActive,
                              '': !isActive,
                            },
                          )}
                        >
                          {isCompleted && '✅'} {title}
                        </a>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </nav>
          )}
        </aside>
        <main className="col-span-9 bg-white px-16">
          <article className="py-16 mx-auto">
            <h1 className="text-5xl font-extrabold pb-10">{title}</h1>
            <hr className="w-8 border border-gray-300 mb-16" />
            <div className="prose md:prose-lg max-w-none">
              <PortableText value={body} components={PortableTextComponents} />
            </div>
          </article>
        </main>
      </div>
      <section role="contentinfo" className="py-16 bg-gray-50 w-full">
        <div
          className={cx(
            'max-w-screen-lg mx-auto w-full items-center justify-center lg:divide-x divide-gray-200 lg:gap-0 gap-16',
            {
              'grid lg:grid-cols-2 grid-cols-1': nextLesson,
              flex: !nextLesson,
            },
          )}
        >
          <ProgressToggle />
          {nextLesson && (
            <div className="text-center">
              <p className="text-xl font-bold pb-1">Up next</p>
              <p className="text-gray-700">
                There {pluralize('is', numberOfLessonsLeftInSection)}{' '}
                {numberOfLessonsLeftInSection} more{' '}
                {pluralize('lesson', numberOfLessonsLeftInSection)} in this
                section
              </p>
              <Link
                passHref
                href={`/learn/${module.slug}/${section.slug}/${nextLesson.slug}`}
              >
                <a className="hover:shadow-md transition-all mt-4 inline-flex items-center justify-center text-gray-800 font-medium px-4 py-3 rounded-md bg-white shadow-sm">
                  <span>{nextLesson.title}</span>
                  <ChevronRightIcon className="w-5" aria-hidden="true" />
                </a>
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

export default LessonTemplate
