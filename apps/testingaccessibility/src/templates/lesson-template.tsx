import React from 'react'
import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/solid'
import {useProgress} from 'context/progress-context'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {Switch} from '@headlessui/react'
import {useReward} from 'react-rewards'
import {useRouter} from 'next/router'
import PortableTextComponents from 'components/portable-text'
import BreadcrumbNav from 'components/breadcrumb'
import Layout from 'components/app/layout'
import indexOf from 'lodash/indexOf'
import isEmpty from 'lodash/isEmpty'
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

  const nextLesson = lessons[currentLessonIndex + 1]
  const prevLesson = lessons[currentLessonIndex - 1] ?? null

  const ProgressToggle = () => {
    const {reward} = useReward('rewardId', 'confetti', {
      zIndex: 50,
      lifetime: 50,
      startVelocity: 10,
      position: 'absolute',
    })
    const [enabled, setEnabled] = React.useState(isCurrentLessonCompleted)
    const [isControlDisabled, setControlDisabled] = React.useState(false)
    function classNames(...classes: any) {
      return classes.filter(Boolean).join(' ')
    }

    return (
      <div className="p-5 flex items-center justify-center rounded-md shadow-lg bg-white relative z-50">
        <Switch.Group as="div" className="flex items-center">
          <Switch.Label as="span" className="mr-3">
            <span className="text-gray-900">Complete</span>
          </Switch.Label>
          <Switch
            disabled={isControlDisabled}
            checked={enabled}
            onChange={() => {
              setEnabled(!enabled)
              setControlDisabled(true)
              toggleLessonComplete(slug)
                .then(() => {
                  setControlDisabled(false)
                })
                .catch(() => {
                  setControlDisabled(false)
                  setEnabled(isCurrentLessonCompleted)
                })
              !enabled && reward()
            }}
            className={cx(
              'relative inline-flex disabled:opacity-50 flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
              {
                'bg-green-600': enabled,
                'bg-gray-200': !enabled,
              },
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                enabled ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
              )}
            />
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
            <hr className="w-8 border-2 border-gray-300 mb-16" />
            <div className="prose md:prose-lg max-w-none">
              <PortableText value={body} components={PortableTextComponents} />
            </div>
          </article>
        </main>
      </div>
      <section className="py-16 bg-gray-50 w-full shadow-inner">
        <div className="max-w-screen-lg mx-auto w-full flex items-center justify-center gap-24">
          {prevLesson && (
            <Link
              href={`/learn/${module.slug}/${section.slug}/${prevLesson.slug}`}
            >
              <a className="flex items-center justify-center">
                <ChevronLeftIcon className="w-5" aria-hidden="true" />
                <span className="">Previous lesson</span>
              </a>
            </Link>
          )}
          <ProgressToggle />
          {nextLesson && (
            <Link
              href={`/learn/${module.slug}/${section.slug}/${nextLesson.slug}`}
            >
              <a className="flex items-center justify-center">
                <span className="">Next lesson</span>
                <ChevronRightIcon className="w-5" aria-hidden="true" />
              </a>
            </Link>
          )}
        </div>
      </section>
    </Layout>
  )
}

export default LessonTemplate
